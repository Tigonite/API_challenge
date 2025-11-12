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

    test("04 GET /todo (404)", async ( { request } ) => {
        let response = await request.get(`${URL}/todo`, {
            headers: {
                "x-challenger": token
            }},
        );

        expect(response.status()).toBe(404);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
    });

    test("05 GET /todos/{id} (200)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 1;
        let response = await request.get(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token
            }},
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.todos.length).toBe(1);
    });

    test("06 GET /todos/{id} (404)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 11;
        let response = await request.get(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token
            }},
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(404);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.todos).toBe(undefined);
    });

    test("07 GET /todos (200) ?filter", async ( { request } ) => {
        let response = await request.get(`${URL}/todos?doneStatus=false`, {
            headers: {
                "x-challenger": token
            }},
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.todos[0].doneStatus).toBe(false);
    });
})