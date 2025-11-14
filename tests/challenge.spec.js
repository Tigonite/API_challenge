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

    test("15 POST /todos (400) extra", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    doneStatus: false,
                    title: 'one two three and so on and so on and so on and so',
                    description: 'bla',
                    priority: "high",
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(400);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain('Could not find field: priority');
    });

    test("16 PUT /todos/{id} (400)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 11;
        let response = await request.put(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    doneStatus: false,
                    title: 'one two three',
                    description: 'bla',
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(400);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain('Cannot create todo with PUT due to Auto fields id');
    });

    test("17 POST /todos/{id} (200)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 1;
        let response = await request.post(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    title: 'one two three',
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.title).toBe('one two three');
    });

    test("18 POST /todos/{id} (404)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 11;
        let response = await request.post(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    title: 'one two three',
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(404);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain('No such todo entity instance with id');
    });

    test("19 PUT /todos/{id} full (200)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 1;
        let response = await request.put(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    doneStatus: true,
                    title: 'one two three',
                    description: 'bla',
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.doneStatus).toBe(true);
        expect(body.title).toBe('one two three');
        expect(body.description).toBe('bla');
    });

    test("20 PUT /todos/{id} full (200)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 1;
        let response = await request.put(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    title: 'one two three',
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.title).toBe('one two three');
    });

    test("21 PUT /todos/{id} no title (400)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 1;
        let response = await request.put(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    title: null,
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(400);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain('title : field is mandatory');
    });

    test("22 PUT /todos/{id} no amend id (400)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 1;
        let todo_wrong_id = Math.floor(Math.random() * 10) + 11;
        let response = await request.put(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token}, 
                data: {
                    id: todo_wrong_id,
                    doneStatus: true,
                    title: 'one two three',
                    description: 'bla',
                }
            },
        );
        let body = await response.json();
        let headers = response.headers();

        expect(response.status()).toBe(400);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain('Can not amend id from');
    });

    test("23 DELETE /todos/{id} (200)", async ( { request } ) => {
        let todo_id = Math.floor(Math.random() * 10) + 1;
        let response = await request.delete(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token}, 
            },
        );
        let re_response = await request.get(`${URL}/todos/${todo_id}`, {
            headers: {
                "x-challenger": token}, 
            },
        );

        let body = await re_response.json();
        let headers = re_response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.errorMessages[0]).toContain('Could not find an instance with');
    });

    test("24 OPTIONS /todos (200)", async ({ request }) => {
    let response = await request.fetch(`${URL}/todos`, {
      method: "OPTIONS",
      headers: {
        "x-challenger": token,
      },
    });
    let headers = response.headers();
    expect(response.status()).toBe(200);
    expect(headers["allow"]).toContain("OPTIONS");
    expect(headers["allow"]).toContain("GET");
    expect(headers["allow"]).toContain("POST");
    expect(headers["allow"]).toContain("HEAD");
    expect(headers["allow"]).not.toContain("PUT");
    expect(headers["allow"]).not.toContain("DELETE");
    expect(headers["allow"]).not.toContain("PATCH");
    });

    test("25 GET /todos (200) XML", async ( { request } ) => {
        let response = await request.get(`${URL}/todos`, {
            headers: {
                "x-challenger": token,
                accept: "application/xml",
            }, 
            },
        );

        let headers = response.headers();
        let body = response.text();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/xml");
    });

    test("26 GET /todos (200) JSON", async ( { request } ) => {
        let response = await request.get(`${URL}/todos`, {
            headers: {
                "x-challenger": token,
                accept: "application/json",
            }, 
            },
        );

        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/json");
    });

    test("27 GET /todos (200) ANY", async ( { request } ) => {
        let response = await request.get(`${URL}/todos`, {
            headers: {
                "x-challenger": token,
                accept: "*/*",
            }, 
            },
        );

        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/json");
    });

    test("28 GET /todos (200) XML pref", async ( { request } ) => {
        let response = await request.get(`${URL}/todos`, {
            headers: {
                "x-challenger": token,
                accept: "application/xml, application/json",
            }, 
            },
        );

        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/xml");
    });

    test("29 GET /todos (200) no accept", async ( { request } ) => {
        let response = await request.get(`${URL}/todos`, {
            headers: {
                "x-challenger": token,
            }, 
            },
        );

        let headers = response.headers();

        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/json");
    });

    test("30 GET /todos (406)", async ( { request } ) => {
        let response = await request.get(`${URL}/todos`, {
            headers: {
                "x-challenger": token,
                accept: "application/gzip",
            }, 
            },
        );

        let headers = response.headers();

        expect(response.status()).toBe(406);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/json");
    });

    test("31 POST /todos XML", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token,
                "Content-Type": 'application/xml',
                "accept": "application/xml",
            },
            data: '<?xml version="1.0" encoding="UTF-8"?><todo><doneStatus>true</doneStatus><title>file paperwork today</title></todo>'
            });

        let headers = response.headers();

        expect(response.status()).toBe(201);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/xml");
    });

    test("32 POST /todos JSON", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token,
                "Content-Type": 'application/json',
                "accept": "application/json",
            },
            data: {
                doneStatus: true,
                title: 'one two three',
                description: 'bla',
            }
            });

        let headers = response.headers();

        expect(response.status()).toBe(201);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/json");
    });

    test("33 POST /todos (415)", async ( { request } ) => {
        let response = await request.post(`${URL}/todos`, {
            headers: {
                "x-challenger": token,
                "Content-Type": 'gzip',
                "accept": "application/json",
            },
            data: {
                doneStatus: true,
                title: 'one two three',
                description: 'bla',
            }
            });

        let headers = response.headers();

        expect(response.status()).toBe(415);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/json");
    });

    test("41 DELETE /heartbeat (405)", async ( { request } ) => {
        let response = await request.delete(`${URL}/heartbeat`, {
            headers: {
                "x-challenger": token,
                "Content-Type": 'application/json',
                "accept": "application/json",
            },
            data: {
                doneStatus: true,
                title: 'one two three',
                description: 'bla',
            }
            });

        let headers = response.headers();

        expect(response.status()).toBe(405);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/json");
    });

    test("42 PATCH /heartbeat", async ( { request } ) => {
        let response = await request.patch(`${URL}/heartbeat`, {
            headers: {
                "x-challenger": token,
                "Content-Type": 'application/json',
                "accept": "application/json",
            },
            data: {
                doneStatus: true,
                title: 'one two three',
                description: 'bla',
            }
            });

        let headers = response.headers();

        expect(response.status()).toBe(500);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(headers["content-type"]).toContain("application/json");
    });

});