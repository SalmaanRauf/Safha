import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    showText?: boolean
    size?: 'sm' | 'md' | 'lg'
    href?: string
}

export function Logo({ className, showText = true, size = 'md', href = '/' }: LogoProps) {
    const dimensions = {
        sm: { width: 24, height: 24, textSize: 'text-xl' },
        md: { width: 32, height: 32, textSize: 'text-2xl' },
        lg: { width: 48, height: 48, textSize: 'text-4xl' },
    }

    const { width, height, textSize } = dimensions[size]

    return (
        <Link href={href} className={cn("flex items-center gap-3 group", className)}>
            <div className="relative overflow-hidden transition-transform group-hover:scale-105">
                <Image
                    src="/logo.png"
                    alt="Safha Logo"
                    width={width}
                    height={height}
                    className="object-contain"
                />
            </div>
            {showText && (
                <span className={cn(
                    "font-arabic font-bold text-[hsl(var(--color-primary-600))]",
                    textSize
                )}>
                    صفحة
                </span>
            )}
        </Link>
    )
}
