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
