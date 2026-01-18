import SignupForm from "./SignupForm";

export const metadata = {
    title: "Admin Signup",
};

export default function AdminSignupPage() {
    return (
        <div className="w-full max-w-md mx-4">
            <div className="p-8 bg-card/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-border/50">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
                        <span className="text-3xl">👤</span>
                    </div>
                    <h2 className="text-3xl font-bold">Create Admin</h2>
                    <p className="text-muted-foreground text-sm mt-2">
                        Register a new administrator account
                    </p>
                </div>

                <SignupForm />
            </div>
        </div>
    );
}
