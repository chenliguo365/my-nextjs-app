import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { bazi, question, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "请先设置 API Key" },
        { status: 400 }
      );
    }

    // 构建 prompt
    const prompt = `
用户信息：
- 姓名：${bazi.name}
- 性别：${bazi.gender === "male" ? "男" : "女"}
- 出生日期：${bazi.birthDate}
- 出生时辰：${bazi.birthTime}

用户问题：${question}

请根据用户的生辰八字信息，回答上述问题。回答要专业、客观，避免过度玄学的说法。
`;

    // 调用 AiHubMix API
    const response = await fetch("https://api.aihubmix.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "你是一位专业的命理分析师，精通八字命理。请根据用户提供的生辰八字信息，对其问题进行专业、客观的解答。避免使用过于玄学或不科学的说法。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: "API Key 无效" },
          { status: 401 }
        );
      }
      throw new Error("AiHubMix API request failed");
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 