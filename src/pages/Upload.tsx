import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudUpload, FileText, Info, Send, Paperclip, X, HelpCircle, ShieldCheck, ArrowRight, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useFileUpload } from '../hooks/useStorage';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { progress, uploading, uploadFile, resetUpload } = useFileUpload();
  const contributorRole = userProfile?.role || 'student';

  // Form state
  const [file, setFile] = React.useState<File | null>(null);
  const [courseName, setCourseName] = React.useState('');
  const [courseCode, setCourseCode] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [semester, setSemester] = React.useState('1st Semester');
  const [docType, setDocType] = React.useState('Past Question');
  const [year, setYear] = React.useState('2023/2024');

  // Submission state
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (f: File) => {
    setError(null);
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'];
    if (!allowedTypes.includes(f.type)) {
      setError('Only PDF, DOCX, or ZIP files are allowed.');
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError('File size must be under 50MB.');
      return;
    }
    setFile(f);
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    if (file) completed++;
    if (courseName && courseCode) completed++;
    if (level) completed++;
    return Math.round((completed / 3) * 100);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!courseName || !courseCode || !level) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!user) {
      setError('You must be logged in to upload.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload file to Firebase Storage
      const filePath = `papers/${user.uid}/${Date.now()}_${file.name}`;
      const downloadUrl = await uploadFile(file, filePath);

      // 2. Create Firestore document
      await addDoc(collection(db, 'papers'), {
        title: courseName,
        courseCode: courseCode.toUpperCase(),
        level,
        year,
        semester,
        type: docType,
        downloads: 0,
        pages: 0,
        date: 'Just now',
        status: 'under-review',
        fileUrl: downloadUrl,
        uploadedBy: user.uid,
        uploaderName: userProfile?.displayName || user.email,
        contributorRole,
        contributorEmail: userProfile?.email || user.email || '',
        facultyId: userProfile?.faculty || '',
        departmentId: userProfile?.department || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCourseName('');
    setCourseCode('');
    setLevel('');
    setSemester('1st Semester');
    setDocType('Past Question');
    setYear('2023/2024');
    setSubmitted(false);
    setError(null);
    resetUpload();
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-8">
        <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-green-100">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-4xl font-headline font-extrabold text-primary">Contribution Submitted!</h2>
        <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
          Your document has been uploaded successfully and is now under review. You'll be notified once it's verified and published.
        </p>
        <div className="flex justify-center gap-6 pt-4">
          <button onClick={handleReset} className="px-10 py-4 bg-slate-50 text-primary font-bold rounded-2xl hover:bg-slate-100 transition-all">
            Upload Another
          </button>
          <button onClick={() => navigate('/')} className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
      <header className="space-y-6">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Repository</button>
          <ArrowRight className="w-3 h-3" />
          <span className="text-primary">Upload Content</span>
        </nav>
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold text-primary tracking-tight mb-4 leading-tight">Contribute to the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-red-400">Institutional Archive</span></h1>
          <p className="text-slate-500 text-base sm:text-lg lg:text-xl font-light leading-relaxed">Your contributions empower future researchers and students. Please ensure all documents meet the institution's academic integrity standards.</p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 max-w-4xl">
        <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
          {contributorRole === 'admin' ? 'Admin' : contributorRole === 'staff' ? 'Staff' : 'Student'} Contributor
        </span>
        <span className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-100">
          Past question uploads go to review before publication
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 max-w-4xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-10 xl:gap-12">
        <div className="xl:col-span-8 space-y-10">
          {/* Section 1: File Upload */}
          <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">1</div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary">Upload Source Files</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Primary Document Asset</p>
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl text-slate-300">
                <Info className="w-5 h-5" />
              </div>
            </div>
            
            <div 
              className={`border-4 border-dashed rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-16 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white hover:border-primary/20 transition-all cursor-pointer group/dropzone relative overflow-hidden ${isDragging ? 'border-primary/40 bg-primary/5' : 'border-slate-100'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx,.zip"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/dropzone:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-3xl flex items-center justify-center mb-5 sm:mb-6 shadow-xl group-hover/dropzone:scale-110 transition-transform relative z-10">
                <CloudUpload className="text-primary w-8 h-8 md:w-10 md:h-10" />
              </div>
              <p className="text-primary font-bold text-base sm:text-lg md:text-xl mb-2 relative z-10 text-center">Drag and drop your documents here</p>
              <p className="text-slate-400 font-medium mb-6 sm:mb-8 relative z-10 text-sm sm:text-base text-center">PDF, DOCX, or ZIP up to 50MB</p>
              <button type="button" className="bg-primary text-white px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-sm hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center gap-3 relative z-10">
                <Paperclip className="w-5 h-5" />
                Browse Files
              </button>
            </div>

            {file && (
              <div className="mt-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-2xl border-2 border-slate-50 shadow-sm hover:border-primary/10 transition-all">
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner shrink-0">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-primary truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] mt-1">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB • Ready for verification
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Metadata */}
          <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-tertiary"></div>
            <div className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-12">
              <div className="w-12 h-12 rounded-2xl bg-tertiary text-primary flex items-center justify-center font-black text-xl shadow-lg shadow-tertiary/20">2</div>
              <div>
                <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary">Academic Metadata</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Categorization & Indexing</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 opacity-60">Course Name *</label>
                <input 
                  type="text" 
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Introduction to Computing" 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl p-4 text-sm font-semibold transition-all" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 opacity-60">Course Code *</label>
                <input 
                  type="text" 
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CSC 101" 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl p-4 text-sm font-semibold transition-all" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 opacity-60">Academic Level *</label>
                <select 
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl p-4 text-sm font-semibold transition-all appearance-none"
                >
                  <option value="">Select Level</option>
                  <option>100 Level</option>
                  <option>200 Level</option>
                  <option>300 Level</option>
                  <option>400 Level</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 opacity-60">Semester</label>
                <div className="flex gap-3 p-1.5 bg-slate-50 rounded-2xl border-2 border-transparent">
                  <button 
                    type="button"
                    onClick={() => setSemester('1st Semester')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${semester === '1st Semester' ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-primary'}`}
                  >
                    First
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSemester('2nd Semester')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${semester === '2nd Semester' ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-primary'}`}
                  >
                    Second
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 opacity-60">Document Type</label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl p-4 text-sm font-semibold transition-all appearance-none"
                >
                  <option>Past Question</option>
                  <option>Lecture Note</option>
                  <option>Research Paper</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 opacity-60">Academic Year</label>
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/10 focus:ring-4 focus:ring-primary/5 focus:bg-white rounded-2xl p-4 text-sm font-semibold transition-all appearance-none"
                >
                  <option>2023/2024</option>
                  <option>2022/2023</option>
                  <option>2021/2022</option>
                  <option>2020/2021</option>
                </select>
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1 opacity-60">Contribution Note</label>
                <textarea
                  value={''}
                  readOnly
                  className="w-full min-h-28 bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-sm font-semibold text-slate-400 resize-none"
                  placeholder="Past questions, lecture notes, and supporting material are accepted from students, staff, and admins."
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6">
            <button 
              onClick={handleReset}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 text-slate-400 font-bold hover:text-primary hover:bg-white rounded-2xl transition-all"
            >
              Discard Draft
            </button>
            <button 
              onClick={handleSubmit}
              disabled={submitting || uploading}
              className="w-full sm:w-auto px-10 sm:px-12 py-5 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting || uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploading ? `Uploading ${progress}%` : 'Saving...'}
                </>
              ) : (
                <>
                  Submit Contribution
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 ring-1 ring-black/5">
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-300 mb-8">Submission Status</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${submitting ? 'bg-secondary' : 'bg-primary'} animate-pulse`}></div>
                  <span className="text-sm font-black text-primary uppercase tracking-widest">
                    {submitting ? 'Uploading' : 'Draft Mode'}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">{uploading ? `${progress}%` : `${getCompletionPercentage()}%`}</span>
              </div>
              <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden p-0.5 border border-slate-100">
                <div 
                  className="bg-primary h-full rounded-full shadow-lg shadow-primary/20 transition-all duration-500" 
                  style={{ width: `${uploading ? progress : getCompletionPercentage()}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl text-xs font-bold text-slate-500">
                <Clock className="w-4 h-4 text-primary" />
                {file ? (level ? 'All steps completed' : 'Step 2 of 3 — fill metadata') : 'Step 1 of 3 — select file'}
              </div>
            </div>
          </div>

          <div className="bg-primary text-white p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
            <h3 className="font-headline font-extrabold text-xl sm:text-2xl mb-6 sm:mb-8 relative z-10">Upload <br/><span className="text-tertiary">Guidelines</span></h3>
            <ul className="space-y-5 sm:space-y-6 relative z-10">
              <li className="flex gap-4 group/item">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover/item:bg-tertiary group-hover/item:text-primary transition-all">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-sm text-blue-100/80 leading-relaxed font-light">Ensure all text is legible and scanned at high resolution (300 DPI recommended).</p>
              </li>
              <li className="flex gap-4 group/item">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover/item:bg-tertiary group-hover/item:text-primary transition-all">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-sm text-blue-100/80 leading-relaxed font-light">Double-check course codes and academic sessions for accurate indexing.</p>
              </li>
              <li className="flex gap-4 group/item">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover/item:bg-tertiary group-hover/item:text-primary transition-all">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-sm text-blue-100/80 leading-relaxed font-light">Only upload materials you have the right to share within the institution.</p>
              </li>
            </ul>
            <FileText className="absolute -right-12 -bottom-12 w-48 h-48 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>

          <div className="bg-slate-50 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <HelpCircle className="text-slate-400 w-8 h-8" />
            </div>
            <h4 className="font-bold text-primary mb-2">Need Assistance?</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Our administrative team is available to help with complex uploads or copyright questions.</p>
            <button className="text-xs font-black uppercase tracking-widest text-secondary hover:underline">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};
