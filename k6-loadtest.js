import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

// Custom metrics
const errorRate = new Rate("errors");

// Test configuration
export const options = {
  stages: [
    // Ramp up to 1000 RPS over 30 seconds
    { duration: "30s", target: 1000 },
    // Maintain 1000 RPS for 2 minutes
    { duration: "2m", target: 1000 },
    // Ramp down to 0 RPS over 30 seconds
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    // 95% of requests must complete below 500ms
    http_req_duration: ["p(95)<500"],
    // 99% of requests must complete below 1000ms
    http_req_duration: ["p(99)<1000"],
    // Error rate must be below 1%
    errors: ["rate<0.01"],
    // 95% of requests must complete below 200ms
    http_req_duration: ["p(95)<200"],
  },
};

const postIds = [
  "a74b9979-6e63-4c7b-a1ac-4e97f9e0974d",
  "faabaacb-4f09-4f1d-b536-2124248b2a44",
  "a691c251-d9e7-4c76-8f78-ba8edae6e6d7",
  "d3ed276e-601d-4a9c-b234-fba9f8f97cd9",
  "2a386189-59c1-4883-9e51-cf39aa6b5e64",
  "e9d53908-5bcc-4de7-b706-5daaee229e00",
  "e174c1ac-41d9-41f8-86be-01e25a523751",
  "83aca283-a712-4e5c-8bce-55730ce8762d",
  "f5ad80cf-a58c-4c34-ad7a-660a2dba951d",
  "24ba6cad-f2a7-4d11-8d7d-f67acc34449d",
];
// Main test function
export default function () {
  // Randomly select a post id for each request
  const randomPostId = postIds[Math.floor(Math.random() * postIds.length)];

  // Make request to the posts endpoint with post id parameter
  const response = http.get(`http://localhost:8080/api/posts/${randomPostId}`);

  // Check if the response is successful
  const success = check(response, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
    "response time < 1000ms": (r) => r.timings.duration < 1000,
  });

  // Record errors
  errorRate.add(!success);

  // Add a small sleep to prevent overwhelming the server
  // This helps maintain the target RPS while being respectful to the server
  sleep(0.1);
}

// Setup function (optional) - runs once before the test
export function setup() {
  console.log("Starting k6 load test with 1000 RPS target");
  console.log("Server should be running on http://localhost:8080");
}

// Teardown function (optional) - runs once after the test
export function teardown(data) {
  console.log("Load test completed");
}
