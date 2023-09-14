import { Client } from "@elastic/elasticsearch";

const esClient = new Client({
    cloud: {
        id: "Elastics-discord:YXNpYS1zb3V0aGVhc3QyLmdjcC5lbGFzdGljLWNsb3VkLmNvbSQxMjJlNjdkMjVhOTI0YzEzYTliY2E5MDlhMzYwMWM1ZCQwN2JkOTJjYWRkMGQ0ZjliOGYzNTc1NTdlZjI2NWFkMw==",
    },
    auth: {
        username: "elastic",
        password: "C8P6vV4RQv5LOAKVa1GVJJTP",
    },
});

export default esClient;
