import ResumeViewer from '../../resume/ResumeViewer';

export default function ResumeSection() {
    return (
        <div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl rounded-2xl border border-line bg-surface/95 shadow-brand backdrop-blur-xl">
            <ResumeViewer tone="standard" />
        </div>
    );
}
