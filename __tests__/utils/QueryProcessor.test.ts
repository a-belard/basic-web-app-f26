import QueryProcessor from "../../utils/QueryProcessor";
import '@testing-library/jest-dom'

describe("QueryProcessor", () => {
    test("should return a string", () => {
        const query = "test";
        const response: string = QueryProcessor(query);
        expect(typeof response).toBe("string");
    });

    test('should return shakespeare description', () => {
        const query = "shakespeare";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
            "English poet, playwright, and actor, widely regarded as the greatest " +
            "writer in the English language and the world's pre-eminent dramatist."
          ));
    });

    test('should return name', () => {
        const query = "What is your name?";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "hiProf"
          ));
    })

    test('should return Andrew ID', () => {
        const response: string = QueryProcessor("What is your Andrew ID?");
        expect(response).toBe("brutayis");
    });

    test('should return Andrew ID regardless of case and spacing', () => {
        expect(QueryProcessor("what is your andrewid")).toBe("brutayis");
        expect(QueryProcessor("WHAT IS YOUR ANDREW ID?")).toBe("brutayis");
    });
});
