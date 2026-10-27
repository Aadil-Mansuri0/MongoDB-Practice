// ============================================================================
// MongoDB Replication - Complete Practical
// Database: MongoDBReplicationLab
// Collection: orders
// Replica set: rs0 (three local members)
// Run from mongosh connected to the replica-set URI (see setup below).
// ============================================================================
//
// LEARNING OBJECTIVES
// 1. Understand replication and replica-set architecture.
// 2. Set up a three-member replica set locally.
// 3. Inspect Primary and Secondary roles and replication status.
// 4. Compare readPreference modes.
// 5. Demonstrate writeConcern and readConcern.
// 6. Inspect replication lag / optime information.
// 7. Understand elections and safely practise primary failover.
//
// IMPORTANT SETUP NOTES
// - This is a LOCAL LEARNING LAB, not a production deployment.
// - Requires a MongoDB Server installation with mongod and mongosh.
// - Start three mongod processes first, then initiate rs0 once.
// - Use separate data directories for each member.
// - Do not expose this unauthenticated local lab to a network.
// - This script does not automatically step down the primary.
//   Failover is a separate, manual exercise at the bottom.
// ============================================================================
//
// STEP 0 - START THREE LOCAL MONGOD MEMBERS
// Run each command in a separate terminal on macOS/Linux.
// Create directories once:
//
//   mkdir -p ~/mongodb-rs/node1 ~/mongodb-rs/node2 ~/mongodb-rs/node3
//
// Terminal 1:
//   mongod --replSet rs0 --port 27017 --dbpath ~/mongodb-rs/node1 --bind_ip localhost
//
// Terminal 2:
//   mongod --replSet rs0 --port 27018 --dbpath ~/mongodb-rs/node2 --bind_ip localhost
//
// Terminal 3:
//   mongod --replSet rs0 --port 27019 --dbpath ~/mongodb-rs/node3 --bind_ip localhost
//
// STEP 1 - CONNECT TO ONE MEMBER
// In another terminal:
//
//   mongosh "mongodb://localhost:27017/?directConnection=true"
//
// Then initiate the set ONCE in mongosh:
//
//   rs.initiate({
//     _id: "rs0",
//     members: [
//       { _id: 0, host: "localhost:27017" },
//       { _id: 1, host: "localhost:27018" },
//       { _id: 2, host: "localhost:27019" }
//     ]
//   })
//
// Wait for election and confirm:
//
//   rs.status()
//   db.hello()
//
// STEP 2 - RECONNECT THROUGH THE REPLICA-SET URI
// Exit the direct connection and use:
//
//   mongosh "mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0"
//
// Run this file from that connected shell:
//
//   load("36-replication-complete-practical.js")
//
// ============================================================================

// Select a dedicated database and collection for this lesson.
// The collection is not dropped, so rerunning this script does not erase data.
const labDb = db.getSiblingDB("MongoDBReplicationLab");
const orders = labDb.getCollection("orders");
const hello = db.hello();

print("\n============================================================");
print("0. CONNECTION CHECK");
print("============================================================");
printjson({
    connectedSetName: hello.setName || null,
    isWritablePrimary: hello.isWritablePrimary,
    secondary: hello.secondary,
    primary: hello.primary || null,
    me: hello.me || null
});

if (hello.setName !== "rs0") {
    print("\nSTOP: This shell is not connected to replica set rs0.");
    print("Follow the setup commands at the top of this file, then reconnect");
    print("using the replicaSet URI before running this practical again.");
} else {

// ============================================================================
// 1. REPLICATION PURPOSE AND PRIMARY / SECONDARY ROLES
// ============================================================================
// Replication maintains copies of the same data on multiple replica-set
// members. The Primary accepts writes. Secondaries replicate the Primary's
// oplog and can serve reads when the chosen read preference allows it.
// A three-voting-member set can normally elect a new Primary if one member
// becomes unavailable, provided a majority of voting members can communicate.

    print("\n============================================================");
    print("1. REPLICA SET STATUS");
    print("============================================================");
    print("Replica set name: " + hello.setName);
    print("Current connection reports writable primary: " + hello.isWritablePrimary);
    print("Current connection reports secondary: " + hello.secondary);
    print("\nMember states (stateStr should show PRIMARY / SECONDARY):");
    const status = rs.status();
    printjson(status.members.map(function (member) {
        return {
            name: member.name,
            state: member.stateStr,
            health: member.health,
            uptimeSeconds: member.uptime,
            optimeDate: member.optimeDate,
            lastHeartbeat: member.lastHeartbeat
        };
    }));

// ============================================================================
// 2. CREATE PRACTICE DATA ON THE PRIMARY
// ============================================================================
// A write sent through the replica-set connection is routed to the Primary.
// Use a unique orderId so this insert can be rerun safely.
    print("\n============================================================");
    print("2. WRITE DATA");
    print("============================================================");

    const orderId = "REPL-LAB-1001";
    const existingOrder = orders.findOne({ orderId: orderId });

    if (!existingOrder) {
        const writeResult = orders.insertOne(
            {
                orderId: orderId,
                customer: "Demo Customer",
                amount: 2499,
                status: "PLACED",
                createdAt: new Date()
            },
            {
                writeConcern: { w: "majority", wtimeout: 10000 }
            }
        );
        print("Inserted order with majority write concern:");
        printjson(writeResult);
    } else {
        print("Sample order already exists; not inserting a duplicate.");
        printjson(existingOrder);
    }

    print("\nCurrent order count through replica-set connection:");
    print(orders.countDocuments({}));

// ============================================================================
// 3. WRITE CONCERN - DURABILITY / ACKNOWLEDGEMENT
// ============================================================================
// w: 1         -> acknowledge after the Primary applies the write.
// w: "majority"-> wait for acknowledgement from a voting majority.
// wtimeoutMS   -> maximum wait for the requested acknowledgement; timeout
//                 does NOT prove the write was rolled back or never applied.
// j: true      -> request journal acknowledgement (subject to deployment
//                 configuration and server/version behavior).
//
// Majority write concern is commonly used when stronger replica-set
// acknowledgement is needed. The appropriate choice depends on latency,
// durability goals, topology and application requirements.

    print("\n============================================================");
    print("3. WRITE CONCERN EXAMPLES (REFERENCE)");
    print("============================================================");
    print("Majority acknowledgement was used in the insert above.");
    print("Example options:");
    printjson({
        primaryAcknowledgement: { w: 1 },
        majorityAcknowledgement: { w: "majority", wtimeout: 10000 },
        majorityAndJournal: { w: "majority", j: true, wtimeout: 10000 }
    });

// ============================================================================
// 4. READ CONCERN - VISIBILITY / CONSISTENCY
// ============================================================================
// Read preference chooses WHICH member is asked to serve a read.
// Read concern controls the consistency/visibility guarantees for returned data.
// These are different settings and should not be treated as interchangeable.
//
// local     -> data visible on the selected member; may include data not yet
//              acknowledged by a majority.
// majority  -> data acknowledged by a majority, according to MongoDB's
//              majority-commit semantics.
// Snapshot/linearizable have additional semantics and restrictions; use them
// only when their documented transaction/operation requirements are met.

    print("\n============================================================");
    print("4. READ CONCERN EXAMPLES (REFERENCE)");
    print("============================================================");
    print("Read concern can be selected per operation, for example:");
    print('orders.find({ orderId: "REPL-LAB-1001" }).readConcern("majority");');
    print("The following operation reads using majority read concern:");
    try {
        printjson(
            orders.find({ orderId: orderId })
                .readConcern("majority")
                .toArray()
        );
    } catch (error) {
        print("Majority read concern example returned an error: " + error.message);
        print("Check server version, topology and current connection.");
    }

// ============================================================================
// 5. READ PREFERENCE - CONSISTENCY / PERFORMANCE TRADE-OFFS
// ============================================================================
// primary            -> reads only from Primary; default mode.
// primaryPreferred   -> prefer Primary; use Secondary if Primary unavailable.
// secondary          -> read only from Secondaries; fails if none are available.
// secondaryPreferred -> prefer Secondaries; can fall back to Primary.
// nearest            -> choose a member with suitable latency, regardless of role.
//
// Secondary reads may be stale because replication is asynchronous. Read
// preference does not itself guarantee strong consistency. Use an appropriate
// read concern and application design when freshness is critical.
//
// We open separate replica-set connections so each example has an explicit
// readPreference without changing the main shell connection.

    print("\n============================================================");
    print("5. READ PREFERENCE DEMONSTRATION");
    print("============================================================");

    const uriBase =
        "mongodb://localhost:27017,localhost:27018,localhost:27019/" +
        "?replicaSet=rs0&serverSelectionTimeoutMS=5000";

    function demonstrateReadPreference(mode) {
        print("\n--- readPreference=" + mode + " ---");
        let connection = null;
        try {
            connection = new Mongo(uriBase + "&readPreference=" + mode);
            const preferenceDb = connection.getDB("MongoDBReplicationLab");
            const memberHello = preferenceDb.runCommand({ hello: 1 });
            printjson({
                requestedReadPreference: mode,
                member: memberHello.me || null,
                primary: memberHello.primary || null,
                isWritablePrimary: memberHello.isWritablePrimary,
                secondary: memberHello.secondary
            });
            print("Sample read result:");
            printjson(
                preferenceDb.orders.find({ orderId: orderId })
                    .limit(1)
                    .toArray()
            );
        } catch (error) {
            print("Read failed for mode '" + mode + "': " + error.message);
            print("This may happen if no eligible member is available.");
        } finally {
            if (connection) {
                try { connection.close(); } catch (closeError) {}
            }
        }
    }

    demonstrateReadPreference("primary");
    demonstrateReadPreference("primaryPreferred");
    demonstrateReadPreference("secondary");
    demonstrateReadPreference("secondaryPreferred");
    demonstrateReadPreference("nearest");

// ============================================================================
// 6. REPLICATION HEALTH / LAG INSPECTION
// ============================================================================
// rs.status() shows member states, heartbeats and optime details.
// rs.printSecondaryReplicationInfo() provides a readable secondary-lag view
// on supported mongosh/server versions. Lag is workload- and network-dependent.

    print("\n============================================================");
    print("6. REPLICATION HEALTH");
    print("============================================================");
    print("Member summary:");
    printjson(
        rs.status().members.map(function (member) {
            return {
                name: member.name,
                state: member.stateStr,
                health: member.health,
                optimeDate: member.optimeDate,
                syncSourceHost: member.syncSourceHost || null,
                lastHeartbeatMessage: member.lastHeartbeatMessage || ""
            };
        })
    );

    print("\nSecondary replication information (if supported):");
    try {
        rs.printSecondaryReplicationInfo();
    } catch (error) {
        print("Could not print secondary lag: " + error.message);
        print("Use rs.status() and inspect optimeDate / syncSourceHost instead.");
    }

// ============================================================================
// 7. ELECTIONS AND PRIMARY FAILURE
// ============================================================================
// When a Primary becomes unavailable, the remaining voting members hold an
// election. A majority is needed for a new Primary. With 3 voting members,
// 2 members can form a majority; a lone member cannot.
//
// Applications should connect with the replicaSet URI, not pin themselves to
// a single host. Drivers discover the Primary and retry eligible operations
// according to retryable-write and driver configuration.
//
// Do not trigger step-down automatically during a normal lesson run.

    print("\n============================================================");
    print("7. ELECTION / FAILOVER PRACTICE");
    print("============================================================");
    print("Current primary according to hello(): " + (hello.primary || "unknown"));
    print("Manual exercise (run separately, only in this disposable local lab):");
    print("  1. Open a second mongosh connected to the replica-set URI.");
    print("  2. Run rs.status() and note the PRIMARY member.");
    print("  3. Connect directly to the current Primary:");
    print('     mongosh "mongodb://localhost:27017/?directConnection=true"');
    print("     Replace port 27017 with the actual Primary's port.");
    print("  4. In that direct shell, run: rs.stepDown(60)");
    print("     The connection may close or return an error as the member steps down.");
    print("  5. Reconnect through the replica-set URI and run db.hello() / rs.status().");
    print("  6. Verify a different member becomes PRIMARY and the former Primary");
    print("     rejoins as SECONDARY after it is eligible.");
    print("  7. Test reading and writing again through the replica-set URI.");
    print("\nNever run rs.stepDown() on a production cluster as a casual test.");

// ============================================================================
// 8. QUICK COMMAND REFERENCE
// ============================================================================
    print("\n============================================================");
    print("8. QUICK COMMAND REFERENCE");
    print("============================================================");
    print("rs.status()                         // detailed replica-set state");
    print("rs.conf()                           // replica-set configuration");
    print("db.hello()                          // role and primary discovery");
    print("rs.printSecondaryReplicationInfo()  // readable replication-lag report");
    print("rs.stepDown(60)                     // manual failover exercise only");
    print("db.getMongo().setReadPref('secondaryPreferred')");
    print("db.getMongo().setReadPref('primary') // restore primary reads");
    print("db.getMongo().setWriteConcern({ w: 'majority', wtimeout: 10000 })");

    print("\nReplication practical completed.");
    print("Database: MongoDBReplicationLab");
    print("Collection: orders");
    print("Note: read results and timing depend on replica-set state and network.");
}
