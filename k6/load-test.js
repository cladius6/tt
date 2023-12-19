import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        // Increase load quickly to hit the rate limit
        { duration: '10s', target: 100 },
        // Keep the load constant to test the rate limit
        { duration: '5m', target: 100 }, // Keep the load for 5 minutes
    ],
    thresholds: {
        // We expect some 429s after hitting the rate limit
        'http_req_failed{status:429}': ['rate>0.8'], // Most requests should fail after hitting the limit
        'http_req_duration': ['p(95)<200'], // 95% of requests must complete below 200ms
    },
};

export default function () {
    let res = http.get('http://localhost:3000/articles'); 

    check(res, {
        'is status 200 or 429': (r) => r.status === 200 || r.status === 429,
    });

    // Sleep for a random period between requests to simulate more realistic traffic
    sleep(Math.random() * 5);
}