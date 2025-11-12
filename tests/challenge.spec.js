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

    test("08 HEAD /todos (200)", async ( { request } ) => {
        let response = await request.head(`${URL}/todos`, {
            headers: {
                "x-challenger": token
            }},
        );
        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
    });

    test("09 POST /todos (201)", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    doneStatus: true,
                    title: 'one two three',
                    description: 'just bla bla bla'
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(201);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.doneStatus).toEqual(true);
        expect(body.title).toBe('one two three');
        expect(body.description).toBe('just bla bla bla');
    });

    test("10 POST /todos (400) doneStatus", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    doneStatus: "true",
                    title: 'one two three',
                    description: 'just bla bla bla'
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(400);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain("Failed Validation: doneStatus should be BOOLEAN");
    });

    test("11 POST /todos (400) title too long", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    doneStatus: false,
                    title: 'one two three and so on and so on and so on and so on',
                    description: 'just bla bla bla'
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(400);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain("Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50");
    });

    test("12 POST /todos (400) description too long", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    doneStatus: false,
                    title: 'one two three',
                    description: "Turn on, I see red Adrenaline crash and crack my head Nitro junkie, paint me dead And I see red hundred plus through black and white War horse, warhead Fuck 'em man, white-knuckle tight Through black and white"
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(400);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain("Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200");
    });

    test("13 POST /todos (201) max out content", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    doneStatus: false,
                    title: 'one two three and so on and so on and so on and so',
                    description: "Turn on, I see red Adrenaline crash and crack my head Nitro junkie, paint me dead And I see red hundred plus through black and white War horse, warhead Fuck 'em man, white-knuckle tight Through blacck"
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(201);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.doneStatus).toEqual(false);
        expect(body.title.length).toBe(50);
        expect(body.description.length).toBe(200);
    });

    test("14 POST /todos (413) content too long", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    doneStatus: false,
                    title: 'one two three and so on and so on and so on and so',
                    description: "Turn on, I see red Adrenaline crash and crack my head Nitro junkie, paint me dead And I see red hundred plus through black and white War horse, warhead Fuck 'em man, white-knuckle tight Through blacck".repeat(26)
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(413);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain("Error: Request body too large, max allowed is 5000 bytes");
    });





})