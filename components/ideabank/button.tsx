import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ideabankButtonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#4282A4] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "bg-[#15425B] text-white hover:bg-[#0F3245] hover:shadow-[0_8px_20px_-8px_rgba(21,66,91,0.5)]",
        secondary: "border border-[#DED8D3] bg-white text-[#111111] hover:border-[#15425B] hover:bg-[#F4F2F1]",
        cyan: "bg-cyan text-cyan-foreground hover:brightness-95",
        ghost: "text-[#15425B] hover:bg-[#EDF7FA]",
      },
      size: {
        default: "",
        sm: "min-h-9 px-4 py-2 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

interface IdeabankButtonProps extends VariantProps<typeof ideabankButtonVariants> {
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function IdeabankButton({
  href,
  className,
  children,
  variant,
  size,
  onClick,
  type = "button",
  disabled,
}: IdeabankButtonProps) {
  const classes = cn(ideabankButtonVariants({ variant, size, className }));
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
