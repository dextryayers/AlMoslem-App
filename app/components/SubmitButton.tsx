'use client';

interface SubmitButtonProps {
  loading: boolean;
  text: string;
  loadingText?: string;
}

export default function SubmitButton({ loading, text, loadingText = 'Processing...' }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`
        w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform
        flex items-center justify-center gap-2 relative overflow-hidden group
        ${loading 
          ? 'bg-emerald-600/80 cursor-not-allowed translate-y-0 shadow-none' 
          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 border border-transparent hover:border-emerald-400/30'
        }
      `}
    >
      {/* Background Shine Effect */}
      {!loading && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-5 h-5 border-2 border-transparent border-b-white/40 rounded-full animate-spin [animation-duration:1.5s]"></div>
            </div>
            <span className="animate-pulse">{loadingText}</span>
          </>
        ) : (
          <span>{text}</span>
        )}
      </div>
    </button>
  );
}
