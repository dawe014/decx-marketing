export default function ProfileBuilderLayout({ children }) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    );
  }