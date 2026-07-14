import { describe, expect, it } from "vitest";
import { オリジンを許可判定する } from "./オリジン許可判定.js";

const 許可ホスト一覧 = ["localhost", "127.0.0.1", "192.168.11.5"];

describe("オリジンを許可判定する", () => {
  it("localhostを許可する", () => {
    expect(オリジンを許可判定する("http://localhost:7100", 許可ホスト一覧)).toBe("許可");
  });

  it("127.0.0.1を許可する", () => {
    expect(オリジンを許可判定する("http://127.0.0.1:5190", 許可ホスト一覧)).toBe("許可");
  });

  it("自機のNIC IPv4アドレスを許可する", () => {
    expect(オリジンを許可判定する("http://192.168.11.5:5190", 許可ホスト一覧)).toBe("許可");
  });

  it("Electronのfile://由来のnull文字列オリジンを許可する", () => {
    expect(オリジンを許可判定する("null", 許可ホスト一覧)).toBe("許可");
  });

  it("許可ホスト一覧に無い外部オリジンを拒否する", () => {
    expect(オリジンを許可判定する("https://evil.example.com", 許可ホスト一覧)).toBe("拒否");
  });

  it("localhostを部分一致で偽装したオリジンを拒否する", () => {
    expect(オリジンを許可判定する("http://evil-localhost.com", 許可ホスト一覧)).toBe("拒否");
    expect(オリジンを許可判定する("http://localhost.evil.com", 許可ホスト一覧)).toBe("拒否");
  });

  it("URLとして解析できないオリジンを拒否する", () => {
    expect(オリジンを許可判定する("not-a-url", 許可ホスト一覧)).toBe("拒否");
  });

  it("許可ホスト一覧に無いNIC IPv4アドレスを拒否する", () => {
    expect(オリジンを許可判定する("http://192.168.99.9:5190", 許可ホスト一覧)).toBe("拒否");
  });
});
