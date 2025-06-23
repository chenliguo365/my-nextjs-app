"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApiKeyStore } from "@/store/apiKey";

interface BaziInfo {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBox() {
  const router = useRouter();
  const [baziInfo, setBaziInfo] = useState<BaziInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey, setApiKey } = useApiKeyStore();
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // 检查是否有八字信息
    const storedInfo = localStorage.getItem("baziInfo");
    if (!storedInfo) {
      toast.error("请先填写生辰八字信息");
      router.push("/");
      return;
    }
    setBaziInfo(JSON.parse(storedInfo));

    // 检查是否有 API Key
    if (!apiKey) {
      setIsSettingsOpen(true);
    }
  }, [router, apiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !baziInfo || !apiKey) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bazi: baziInfo,
          question: userMessage,
          apiKey,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          setIsSettingsOpen(true);
        }
        throw new Error(error.error || "API 请求失败");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "抱歉，出错了，请重试");
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (!tempApiKey.trim()) {
      toast.error("请输入有效的 API Key");
      return;
    }
    setApiKey(tempApiKey.trim());
    setIsSettingsOpen(false);
    toast.success("API Key 已保存");
  };

  if (!baziInfo) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <Card className="flex-1 mr-4">
          <CardHeader>
            <CardTitle className="text-center">八字信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>姓名：{baziInfo.name}</div>
              <div>性别：{baziInfo.gender === "male" ? "男" : "女"}</div>
              <div>出生日期：{baziInfo.birthDate}</div>
              <div>出生时辰：{baziInfo.birthTime}</div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>设置 API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="请输入 AiHubMix API Key"
                  type="password"
                />
                <p className="text-sm text-muted-foreground">
                  请在 AiHubMix 官网获取 API Key
                </p>
              </div>
              <Button onClick={handleSaveApiKey} className="w-full">
                保存
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4 mb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-primary text-primary-foreground ml-8"
                : "bg-muted mr-8"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">AI 正在思考...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入您的问题..."
          disabled={isLoading || !apiKey}
        />
        <Button type="submit" disabled={isLoading || !input.trim() || !apiKey}>
          发送
        </Button>
      </form>
    </div>
  );
} 