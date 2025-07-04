'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCounterStore } from '@/store/counter'
import { Minus, Plus, RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BaziForm } from "@/components/BaziForm";

/**
 * @description 这只是个示例页面，你可以随意修改这个页面或进行全面重构
 */
export default function Home() {
	return (
		<main className="min-h-screen bg-background">
			<BaziForm />
		</main>
	);
}
