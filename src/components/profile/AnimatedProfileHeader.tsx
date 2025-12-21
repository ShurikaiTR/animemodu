interface AnimatedProfileHeaderProps {
    children: React.ReactNode;
}

export default function AnimatedProfileHeader({ children }: AnimatedProfileHeaderProps) {
    return (
        <div className="animate-fade-in-down">
            {children}
        </div>
    );
}
