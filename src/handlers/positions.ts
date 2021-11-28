import { Request } from "itty-router";
const headers = { 'Content-type': 'application/json', "Access-Control-Allow-Origin": "*" }

export async function Position(request: Request): Promise<Response> {
    if (!(request.params && request.params.id)) {
        const response = await CLOUDJOB_DEV.list({"prefix": "position:"});
        return new Response(JSON.stringify(response.keys.map((key) => key.name.split(":")[1])), { headers })
    } else {
        const response = await CLOUDJOB_DEV.get(`position:${request.params.id}`, { type: 'json' })
        return new Response(response ? JSON.stringify(response) : JSON.stringify({ error: 'Not found' }), { headers, status: response ? 200 : 404 })
    }
}

export async function PositionApply(request: Request): Promise<Response> {
    if (!request.json) {
        return new Response(JSON.stringify({ error: "Body missing" }), { headers, status: 400 }) 
    }
    if (!(request.params && request.params.id)) {
        return new Response(JSON.stringify({ error: "Param missing" }), { headers, status: 400 }) 
    }
    const data = await request.json();
    await CLOUDJOB_DEV.put(`application:${request.params.id}:${crypto.randomUUID()}`, JSON.stringify({ 
        name: data.name,
        experience: data.experience,
        education: data.education,
        application: data.application
    }));
    return new Response(JSON.stringify({ success: true }), { headers })
}

export async function Application(request: Request): Promise<Response> {
    if (!request.query) {
        return new Response(JSON.stringify({ error: "Query missing" }), { headers, status: 400 }) 
    }
    if (!request.query.admin_key) {
        return new Response(JSON.stringify({ error: "Admin key missing" }), { headers, status: 400 }) 
    }
    if (request.query.admin_key !== admin_key) {
        return new Response(JSON.stringify({ error: "Admin key invalid" }), { headers, status: 400 }) 
    }
    if (!(request.params && request.params.id)) {
        return new Response(JSON.stringify({ error: "Param missing" }), { headers, status: 400 }) 
    }
    const response = await Promise.all(await (await CLOUDJOB_DEV.list({"prefix": `application:${request.params.id}:`})).keys.map(async (key) => {
        return await CLOUDJOB_DEV.get(key.name, { type: 'json' });
    }));

    return new Response(JSON.stringify(response), { headers })
}

export async function PositionCreate(request: Request): Promise<Response> {
    if (!request.json) {
        return new Response(JSON.stringify({ error: "Body missing" }), { headers, status: 400 }) 
    }
    const data = await request.json();
    if (!data.admin_key) {
        return new Response(JSON.stringify({ error: "Admin key missing" }), { headers, status: 400 }) 
    }
    if (data.admin_key !== admin_key) {
        return new Response(JSON.stringify({ error: "Admin key invalid" }), { headers, status: 400 }) 
    }
    await CLOUDJOB_DEV.put(`position:${crypto.randomUUID()}`, JSON.stringify({ 
        name: data.name,
        description: data.description // Markdown <3
    }));
    return new Response(JSON.stringify({ success: true }), { headers })
}

export async function PositionEdit(request: Request): Promise<Response> {
    if (!request.json) {
        return new Response(JSON.stringify({ error: "Body missing" }), { headers, status: 400 }) 
    }
    const data = await request.json();
    if (!data.admin_key) {
        return new Response(JSON.stringify({ error: "Admin key missing" }), { headers, status: 400 }) 
    }
    if (data.admin_key !== admin_key) {
        return new Response(JSON.stringify({ error: "Admin key invalid" }), { headers, status: 400 }) 
    }
    if (!(request.params && request.params.id)) {
        return new Response(JSON.stringify({ error: "Param missing" }), { headers, status: 400 }) 
    }
    if (!(await CLOUDJOB_DEV.get(`position:${request.params.id}`))) {
        return new Response(JSON.stringify({ error: "Position not found" }), { headers, status: 404 }) 
    }
    await CLOUDJOB_DEV.put(`position:${request.params.id}`, JSON.stringify({ 
        name: data.name,
        description: data.description // Markdown <3
    }));
    return new Response(JSON.stringify({ success: true }), { headers })
}

export async function PositionDelete(request: Request): Promise<Response> {
    if (!request.json) {
        return new Response(JSON.stringify({ error: "Body missing" }), { headers, status: 400 }) 
    }
    const data = await request.json();
    if (!data.admin_key) {
        return new Response(JSON.stringify({ error: "Admin key missing" }), { headers, status: 400 }) 
    }
    if (data.admin_key !== admin_key) {
        return new Response(JSON.stringify({ error: "Admin key invalid" }), { headers, status: 400 }) 
    }
    if (!(request.params && request.params.id)) {
        return new Response(JSON.stringify({ error: "Param missing" }), { headers, status: 400 }) 
    }
    if (!(await CLOUDJOB_DEV.get(`position:${request.params.id}`))) {
        return new Response(JSON.stringify({ error: "Position not found" }), { headers, status: 404 }) 
    }
    await CLOUDJOB_DEV.delete(`position:${request.params.id}`);
    return new Response(JSON.stringify({ success: true }), { headers })
}