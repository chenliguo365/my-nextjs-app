"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 生辰八字表单组件
export function BaziForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: "",
    birthTime: "",
  });

  // 时辰选项
  const timeOptions = [
    { value: "子时", label: "子时 (23:00-1:00)" },
    { value: "丑时", label: "丑时 (1:00-3:00)" },
    { value: "寅时", label: "寅时 (3:00-5:00)" },
    { value: "卯时", label: "卯时 (5:00-7:00)" },
    { value: "辰时", label: "辰时 (7:00-9:00)" },
    { value: "巳时", label: "巳时 (9:00-11:00)" },
    { value: "午时", label: "午时 (11:00-13:00)" },
    { value: "未时", label: "未时 (13:00-15:00)" },
    { value: "申时", label: "申时 (15:00-17:00)" },
    { value: "酉时", label: "酉时 (17:00-19:00)" },
    { value: "戌时", label: "戌时 (19:00-21:00)" },
    { value: "亥时", label: "亥时 (21:00-23:00)" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!formData.name || !formData.gender || !formData.birthDate || !formData.birthTime) {
      toast.error("请填写完整的生辰八字信息");
      return;
    }

    // 保存到 localStorage 并跳转
    localStorage.setItem("baziInfo", JSON.stringify(formData));
    router.push("/chat");
  };

  return (
    <Card className="w-[400px] mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">生辰八字信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入姓名"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">性别</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="请选择性别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">男</SelectItem>
                <SelectItem value="female">女</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">出生日期</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthTime">出生时辰</Label>
            <Select value={formData.birthTime} onValueChange={(value) => setFormData({ ...formData, birthTime: value })}>
              <SelectTrigger>
                <SelectValue placeholder="请选择出生时辰" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">开始咨询</Button>
        </form>
      </CardContent>
    </Card>
  );
} 