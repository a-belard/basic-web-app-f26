import handler from "../../pages/api/index";

function run(q?: string | string[]) {
    const res: any = { statusCode: 0, body: "" };
    res.status = (code: number) => { res.statusCode = code; return res; };
    res.send = (body: string) => { res.body = body; return res; };
    handler({ url: "/api", query: q === undefined ? {} : { q } } as any, res);
    return res;
}

describe("api handler", () => {
    test("answers a question", () => {
        const res = run("What is your Andrew ID?");
        expect(res.statusCode).toBe(200);
        expect(res.body).toBe("brutayis");
    });

    test("does not crash when q is missing", () => {
        const res = run();
        expect(res.statusCode).toBe(200);
        expect(res.body).toContain("/api?q=");
    });

    test("does not crash when q is empty or repeated", () => {
        expect(run("").statusCode).toBe(200);
        expect(run(["shakespeare", "name"]).statusCode).toBe(200);
    });
});
