import { test, expect } from "@playwright/test";

test.describe("Tsets for APIchallenge", () => {
    let URL = "https://apichallenges.herokuapp.com"
    let token

    test.beforeAll(async ( { request } ) => {
        let response = await request.post(`${URL}/challenger`);
        let headers = response.headers();
        token = headers["x-challenger"];
        console.log(` Значение токена: ${token}`);

        expect(response.status()).toBe(201);
    });

    test("02 GET /challenges (200)", async ( { request } ) => {
        let response = await request.get(`${URL}/challenges`, {
            headers: {
                "x-challenger": token
            }},
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.challenges.length).toBe(59)

    });

    test("03 GET /todos (200)", async ( { request } ) => {
        let response = await request.get(`${URL}/todos`, {
            headers: {
                "x-challenger": token
            }},
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.todos.length).toBe(10)
    });
})