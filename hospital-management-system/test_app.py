import unittest
import app as system

class HospitalSystemTests(unittest.TestCase):
    def setUp(self):
        self.client = system.app.test_client()

    def test_pages(self):
        for path in ("/", "/patients", "/doctors", "/appointments", "/billing", "/rooms", "/queries"):
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 200)

    def test_health_endpoint(self):
        r = self.client.get("/api/health")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()["status"], "ok")

    def test_stats_endpoint(self):
        r = self.client.get("/api/stats")
        self.assertEqual(r.status_code, 200)
        self.assertIn("patients", r.get_json())

if __name__ == "__main__":
    unittest.main()
