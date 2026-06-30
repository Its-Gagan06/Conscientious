import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Send, X, CheckCircle2, MapPinned, Loader2, AlertCircle, List, PlusCircle, ThumbsUp, LogIn, UserPlus, PhoneCall, Moon, Sun, Gamepad2, Trophy, ArrowLeft, BarChart2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GamesTab from './components/GamesTab';
import Dashboard from './components/Dashboard';
import CivicAIChat from './components/CivicAIChat';
import NeighborhoodChat from './components/NeighborhoodChat';
import FeedTab from './components/FeedTab';
import ProfileTab from './components/ProfileTab';

const IssueCard = ({ issue, isMine, onLike, activeCommentIssueId, setActiveCommentIssueId, commentText, setCommentText }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
      {issue.image && (
        <div className="p-2 pb-0">
           <img src={issue.image} alt={issue.category} className="w-full h-48 object-cover rounded-2xl" />
        </div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
           <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
             {issue.category}
           </span>
           <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
             <ThumbsUp size={12} className={issue.upvotes > 0 ? "text-blue-500" : ""} /> {issue.upvotes}
           </span>
        </div>
        <p className="text-gray-900 dark:text-gray-100 font-medium text-base mb-3 leading-relaxed">{issue.description}</p>
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
          <MapPin size={14} className="text-gray-400" />
          <span className="truncate">{issue.location?.address || 'Unknown Location'}</span>
        </div>

        {issue.additionalDescriptions && issue.additionalDescriptions.length > 0 && (
          <div className="mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Community Context</p>
            {issue.additionalDescriptions.map((desc, idx) => (
              <p key={idx} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                {desc}
              </p>
            ))}
          </div>
        )}

        {!isMine && (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
            {activeCommentIssueId === issue.id ? (
              <div className="space-y-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="I face this too. Add your context..."
                  className="w-full p-3 text-sm font-medium bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none h-24 transition-all"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={onLike}
                    disabled={!commentText.trim()}
                    className="flex-1 bg-blue-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ThumbsUp size={16} /> Confirm
                  </button>
                  <button 
                    onClick={() => {
                        setActiveCommentIssueId(null);
                        setCommentText('');
                    }}
                    className="px-5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setActiveCommentIssueId(issue.id)}
                className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold text-sm py-2.5 rounded-xl transition-colors"
              >
                <ThumbsUp size={16} /> I face this too
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AuthScreen = ({ onLogin, isDarkMode, toggleDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isLogin) {
      if (!/^\d{10}$/.test(contact)) {
        setError('Contact number must be exactly 10 digits.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        setError('Password must be at least 6 characters and contain both letters and numbers.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const payload = isLogin ? { contact, password } : { name, contact, password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-blue-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          
          <button 
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-colors z-20"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <h1 className="text-2xl font-bold tracking-tight relative z-10">Conscientious</h1>
          <p className="text-blue-100 text-sm mt-1 relative z-10">{isLogin ? 'Welcome back!' : 'Join the community'}</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
              <input
                type="tel"
                required
                pattern="\d{10}"
                title="Contact number must be exactly 10 digits."
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 outline-none transition-all"
                placeholder="10 digits (e.g. 9876543210)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {isLogin ? 'Password' : 'Create a Unique Password'}
              </label>
              <input
                type="password"
                required
                minLength={!isLogin ? 6 : undefined}
                pattern={!isLogin ? "(?=.*[A-Za-z])(?=.*\\d).{6,}" : undefined}
                title={!isLogin ? "Password must be at least 6 characters and contain both letters and numbers." : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 outline-none transition-all"
                placeholder={!isLogin ? "Min 6 chars, letters & numbers" : "••••••••"}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-200 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? <LogIn size={18} /> : <UserPlus size={18} />)}
              <span>{isLogin ? 'Log In' : 'Sign Up'}</span>
            </button>
          </form>

          <div className="mt-4 text-center">
            <button 
              onClick={() => onLogin({ id: 'guest', name: 'Guest', contact: 'N/A', points: 0, reports: 0 })}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft size={16} /> Skip and go to Reports
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }} 
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactsView = ({ location: initialLocation }) => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [citySearch, setCitySearch] = useState(initialLocation?.address || '');
  
  const fetchContacts = async (searchStr) => {
    setIsLoading(true);
    setError('');
    try {
      const payloadLocation = { address: searchStr || 'India' };
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: payloadLocation })
      });
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts);
      } else {
        setError(data.error || 'Failed to fetch contacts');
      }
    } catch (err) {
      setError('Network error. Failed to load local contacts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialLocation?.address) {
       setCitySearch(initialLocation.address);
       fetchContacts(initialLocation.address);
    } else {
       fetchContacts('India');
    }
  }, [initialLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (citySearch.trim()) {
       fetchContacts(citySearch.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
       <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 border-b pb-3 flex items-center gap-2">
         <PhoneCall size={20} className="text-blue-600" />
         Emergency & Department Contacts
       </h2>
       
       <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
         Find contact numbers for departments like Nagar Nigam, Jal Kal Vibhag, etc., based on your city.
       </p>

       <form onSubmit={handleSearch} className="flex gap-2 mb-6">
         <input 
           type="text"
           value={citySearch}
           onChange={(e) => setCitySearch(e.target.value)}
           placeholder="Enter your city (e.g., Lucknow, Mumbai)"
           className="flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 outline-none text-sm transition-all"
         />
         <button 
           type="submit" 
           disabled={isLoading}
           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
         >
           Search
         </button>
       </form>
       
       {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
       ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
       ) : contacts.length > 0 ? (
          <div className="space-y-4">
             {contacts.map((contact, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4 transition-colors hover:bg-blue-50 dark:hover:bg-gray-800">
                   <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{contact.department}</h3>
                   <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
                      <PhoneCall size={14} />
                      <a href={`tel:${contact.contact}`} className="hover:underline">{contact.contact}</a>
                   </div>
                   <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{contact.description}</p>
                </div>
             ))}
          </div>
       ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No contacts found for this area.</p>
       )}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('community_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    const savedDark = localStorage.getItem('community_dark_mode') === 'true';
    setIsDarkMode(savedDark);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('community_dark_mode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleLogin = (userData) => {
    localStorage.setItem('community_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('community_user');
    setUser(null);
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
  }

  return <MainApp user={user} setUser={setUser} onLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
}

function MainApp({ user, setUser, onLogout, isDarkMode, toggleDarkMode }) {
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'feed' | 'profile'
  const [showDailyQuizPrompt, setShowDailyQuizPrompt] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name || '');
  const [editPassword, setEditPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    if (!editName) return;

    if (editPassword && (editPassword.length < 6 || !/[a-zA-Z]/.test(editPassword) || !/[0-9]/.test(editPassword))) {
        alert("Password must be at least 6 characters and contain both letters and numbers.");
        return;
    }

    setIsSavingProfile(true);
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: editName, contact: user.contact, password: editPassword })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('community_user', JSON.stringify(data.user));
        setIsEditingProfile(false);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (e) {
      alert("Error updating profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    const today = new Date().toDateString();
    const prompted = localStorage.getItem(`daily_quiz_prompted_${user.id}_${today}`);
    const completed = localStorage.getItem(`daily_quiz_${user.id}_${today}`);
    if (!prompted && !completed) {
      setShowDailyQuizPrompt(true);
      localStorage.setItem(`daily_quiz_prompted_${user.id}_${today}`, 'true');
    }
  }, [user.id]);

  // Report states
  const [imagePreview, setImagePreview] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [analysisData, setAnalysisData] = useState(null);

  // Manual location states
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualState, setManualState] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualPlace, setManualPlace] = useState('');
  const [manualPostal, setManualPostal] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

    const INDIAN_CITIES = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa", "Kakinada", "Anantapur", "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", "Hindupur", "Bhimavaram"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Roing", "Tezu", "Bomdila", "Aalo", "Daporijo", "Namsai"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Dhubri", "Diphu", "North Lakhimpur", "LUMDING", "Goalpara", "Sivasagar"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra", "Danapur", "Saharsa", "Hajipur", "Sasaram", "Dehri", "Siwan", "Bettiah", "Motihari"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari", "Chirmiri", "Bhatapara", "Mahasamund", "Dalli-Rajhara", "Kawardha", "Kondagaon"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Sanquelim", "Cuncolim", "Valpoi"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Gandhidham", "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch", "Mehsana", "Bhuj", "Porbandar", "Palanpur", "Valsad", "Vapi"],
    "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal", "Hansı"],
    "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Dharamshala", "Palampur", "Baddi", "Nahan", "Paonta Sahib", "Sundarnagar", "Chamba", "Una", "Kullu", "Hamirpur", "Bilaspur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Chirkunda", "Jhumri Telaiya", "Sahibganj", "Chaibasa", "Lohardaga"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru", "Raichur", "Bidar", "Hosapete", "Gadag-Betageri", "Robertsonpet", "Hassan", "Bhadravati", "Chitradurga", "Udupi", "Kolar", "Mandya"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Alappuzha", "Kottayam", "Palakkad", "Manjeri", "Thalassery", "Ponnani", "Vatakara", "Kanhangad", "Payyanur", "Koyilandy", "Parappanangadi", "Kalamassery"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Morena", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Damoh"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Vasai-Virar", "Aurangabad", "Solapur", "Bhiwandi", "Jalgaon", "Amravati", "Nanded", "Kolhapur", "Akola", "Panvel", "Ulhasnagar", "Sangli", "Latur", "Dhule", "Jalna", "Ahmednagar", "Chandrapur", "Parbhani", "Ichalkaranji", "Malegaon"],
    "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Kakching", "Mayang Imphal", "Bishnupur", "Jiribam", "Senapati", "Ukhrul"],
    "Meghalaya": ["Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara", "Williamnagar", "Nongpoh", "Resubelpara"],
    "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit", "Hnahthial"],
    "Nagaland": ["Dimapur", "Kohima", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Kiphire", "Phek", "Mon"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Bargarh", "Rayagada", "Bhawanipatna", "Bolangir", "Kendujhar"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara", "Muktsar", "Barnala", "Rajpura", "Firozpur", "Kapurthala"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Kishangarh", "Baran", "Dhaulpur", "Tonk", "Beawar", "Hanumangarh", "Sawai Madhopur"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Singtam", "Rangpo", "Jorethang", "Nayabazar"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukkudi", "Dindigul", "Thanjavur", "Ranipet", "Sivakasi", "Karur", "Ooty", "Hosur", "Nagercoil", "Kanchipuram"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda", "Jagtial", "Nirmal", "Kamareddy", "Kothagudem"],
    "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Bishalgarh", "Teliamura", "Khowai", "Belonia", "Melaghar", "Ambassa"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", "Budaun", "Rampur", "Shahjahanpur"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Ramnagar", "Pithoragarh", "Manglaur", "Jaspur", "Kichha", "Khatima", "Mussoorie", "Almora"],
    "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "English Bazar", "Baharampur", "Habra", "Kharagpur", "Shantipur", "Dankuni", "Dhulian", "Ranaghat", "Haldia", "Raiganj", "Krishnanagar", "Nabadwip", "Medinipur", "Jalpaiguri", "Balurghat"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "Shahdara", "Rohini", "Dwarka"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Sopore", "Bandipora", "Rajouri", "Udhampur", "Pulwama", "Shopian", "Kupwara", "Ganderbal", "Poonch"]
  };

  const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
  ].sort();

    const handleStateChange = (e) => {
    const stateName = e.target.value;
    setManualState(stateName);
    setManualCity('');
    if (stateName && INDIAN_CITIES[stateName]) {
      setAvailableCities(INDIAN_CITIES[stateName].sort());
    } else {
      setAvailableCities([]);
    }
  };

  const submitManualLocation = () => {
    if (!manualState || !manualCity || !manualPlace || !manualPostal) {
       setLocationError("Please fill all manual location fields");
       return;
    }
    if (manualPostal.length !== 6) {
       setLocationError("Postal code must be exactly 6 digits");
       return;
    }
    const addressStr = `${manualPlace}, ${manualCity}, ${manualState} - ${manualPostal}`;
    setLocation({
      lat: 0,
      lng: 0,
      address: addressStr
    });
    setShowManualLocation(false);
    setLocationError("");
  };

  // Feed states
  const [feedIssues, setFeedIssues] = useState([]);
  const [isFetchingFeed, setIsFetchingFeed] = useState(false);
  const [activeCommentIssueId, setActiveCommentIssueId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFileToUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let addressStr = 'Location attached';

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();
          if (data && data.display_name) {
            addressStr = data.display_name;
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }

        setLocation({
          lat,
          lng,
          address: addressStr
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMsg = 'Unable to retrieve location.';
        if (error.code === 1) { // PERMISSION_DENIED
          errorMsg = 'Location access denied. Please allow permissions, or try opening the app in a new tab.';
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          errorMsg = 'Location information is unavailable.';
        } else if (error.code === 3) { // TIMEOUT
          errorMsg = 'Location request timed out.';
        }
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview || !description || !location) return;

    setIsSubmitting(true);
    setAnalysisData(null);
    setSubmitError('');

    try {
      let base64Image = null;
      if (fileToUpload) {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(fileToUpload);
        });
      }

      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          description,
          location,
          userId: user.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setAnalysisData(data.analysis);
        setSubmitStatus('success');
        
        // Update user points
        const awarded = data.analysis?.pointsAwarded || 0;
        const updatedUser = { 
          ...user, 
          points: data.updatedPoints !== undefined ? data.updatedPoints : (user.points || 0) + awarded,
          reports: data.updatedReports !== undefined ? data.updatedReports : (user.reports || 0) + 1
        };
        setUser(updatedUser);
        localStorage.setItem('community_user', JSON.stringify(updatedUser));
      } else {
        setSubmitError(data.error || "Failed to analyze issue. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError("Something went wrong during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [notification, setNotification] = useState(null);

  const fetchFeed = async (quiet = false) => {
    if (!quiet) setIsFetchingFeed(true);
    try {
        const payloadLocation = location || { address: 'Local Community' };
        const response = await fetch('/api/neighborhood-issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: payloadLocation })
        });
        const data = await response.json();
        if (data.success) {
            const sorted = data.issues.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Check for notifications
            setFeedIssues(prevIssues => {
              if (prevIssues.length > 0) {
                const prevMyIssues = prevIssues.filter(i => i.isUserGenerated && i.userId === user.id);
                const newMyIssues = sorted.filter(i => i.isUserGenerated && i.userId === user.id);
                
                for (const newIssue of newMyIssues) {
                  const prevIssue = prevMyIssues.find(p => p.id === newIssue.id);
                  if (prevIssue && newIssue.upvotes > prevIssue.upvotes) {
                    setNotification("Your problem will be solved faster if there will be more likes on the problem");
                    setTimeout(() => setNotification(null), 5000);
                    break;
                  }
                }
              }
              return sorted;
            });
        }
    } catch (err) {
        console.error("Failed to fetch feed", err);
    } finally {
        if (!quiet) setIsFetchingFeed(false);
    }
  };

  useEffect(() => {
      if (activeTab === 'feed') {
          fetchFeed();
          const intervalId = setInterval(() => fetchFeed(true), 5000);
          return () => clearInterval(intervalId);
      }
  }, [activeTab]);

  useEffect(() => {
    let interval;
    if (activeTab === 'games') {
      interval = setInterval(() => {
        const today = new Date().toDateString();
        const key = `games_time_${user.id}_${today}`;
        const awardedKey = `games_1hr_awarded_${user.id}_${today}`;
        
        let seconds = parseInt(localStorage.getItem(key) || '0', 10);
        seconds += 1;
        localStorage.setItem(key, seconds.toString());

        // Check if >= 1 hour (3600 seconds) and not awarded yet
        if (seconds >= 3600 && localStorage.getItem(awardedKey) !== 'true') {
          localStorage.setItem(awardedKey, 'true');
          const updatedUser = { ...user, points: (user.points || 0) + 5 };
          setUser(updatedUser);
          localStorage.setItem('community_user', JSON.stringify(updatedUser));
          // Could add a toast here, but updating points is enough per requirements
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, user]);

  const handleLike = async (issueId) => {
    try {
        const response = await fetch('/api/like-issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issueId, additionalDescription: commentText })
        });
        const data = await response.json();
        if (data.success) {
            setFeedIssues(prev => prev.map(i => i.id === issueId ? data.issue : i));
            setCommentText('');
            setActiveCommentIssueId(null);
        }
    } catch (err) {
        console.error("Failed to like issue", err);
    }
  };

  const myIssues = feedIssues.filter(i => i.isUserGenerated && i.userId === user.id);
  const neighborIssues = feedIssues.filter(i => !i.isUserGenerated || i.userId !== user.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 pb-20">
      
      {/* Top Header */}
      <div className="bg-blue-600 p-6 text-white text-center relative overflow-hidden shadow-md">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        
        <div className="absolute top-4 left-4 flex gap-2 z-20">
          <button 
            onClick={toggleDarkMode}
            className="bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-colors"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {activeTab !== 'report' && (
            <button 
              onClick={() => setActiveTab(activeTab === 'dashboard' ? 'profile' : 'report')}
              className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
        </div>

        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 shadow-sm border border-white/20 dark:border-gray-700 z-20">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{user.name}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight relative z-10">Conscientious</h1>
        <p className="text-blue-100 text-sm mt-1 relative z-10">Be the part of change</p>
      </div>

      <div className="flex-1 w-full max-w-md mx-auto p-4 mt-2">
        {activeTab === 'report' ? (
           <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden relative pb-8">
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/10 to-teal-400/10 z-0"></div>
             <div className="p-6 relative z-10">
               <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                 <PlusCircle className="text-blue-500" /> Create Report
               </h2>
               <AnimatePresence mode="wait">
                 {submitStatus === 'success' ? (
                   <motion.div
                     key="success"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="flex flex-col items-center justify-center py-8 text-center space-y-4"
                   >
                     <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2">
                       <CheckCircle2 size={32} />
                     </div>
                     <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Report Submitted!</h2>
                     
                     {analysisData && (
                       <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-5 text-left w-full shadow-sm mt-2">
                         <div className="flex items-center justify-between mb-3">
                           <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">
                             {analysisData.category}
                           </span>
                           <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                             +{analysisData.pointsAwarded} Points
                           </span>
                         </div>
                         <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                           {analysisData.encouragementMessage}
                         </p>
                       </div>
                     )}
                     
                     <button
                       onClick={() => {
                         setSubmitStatus('idle');
                         setImagePreview(null);
                         setFileToUpload(null);
                         setLocation(null);
                         setDescription('');
                         setAnalysisData(null);
                         if (fileInputRef.current) fileInputRef.current.value = '';
                       }}
                       className="mt-6 w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-colors"
                     >
                       Report Another Issue
                     </button>
                   </motion.div>
                 ) : (
                   <motion.form
                     key="form"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onSubmit={handleSubmit}
                     className="space-y-6"
                   >
                     
                     {/* Image Upload Section */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Photo Evidence <span className="text-red-500">*</span>
                       </label>
                       <input
                         type="file"
                         accept="image/*"
                         className="hidden"
                         ref={fileInputRef}
                         onChange={handleImageChange}
                       />
                       
                       {imagePreview ? (
                         <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 group">
                           <img
                             src={imagePreview}
                             alt="Preview"
                             className="w-full h-48 object-cover"
                           />
                           <button
                             type="button"
                             onClick={removeImage}
                             className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                           >
                             <X size={18} />
                           </button>
                         </div>
                       ) : (
                         <button
                           type="button"
                           onClick={() => fileInputRef.current?.click()}
                           className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                         >
                           <Camera size={28} className="mb-2" />
                           <span className="text-sm font-medium">Take Photo or Upload (Required)</span>
                         </button>
                       )}
                     </div>

                     {/* Location Section */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Issue Location <span className="text-red-500">*</span>
                       </label>
                       
                       {location ? (
                         <div className="flex items-center justify-between p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                           <div className="flex items-center gap-3 overflow-hidden">
                             <MapPinned size={20} className="text-blue-600 flex-shrink-0" />
                             <span className="text-sm font-medium truncate" title={location.address || 'Location attached'}>
                               {location.address || 'Location attached'}
                             </span>
                           </div>
                           <button
                             type="button"
                             onClick={() => setLocation(null)}
                             className="text-blue-600 hover:text-blue-800 p-1 flex-shrink-0 ml-2"
                           >
                             <X size={16} />
                           </button>
                         </div>
                       ) : showManualLocation ? (
                         <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                           <div className="flex justify-between items-center mb-1">
                             <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enter Location Manually</h4>
                             <button type="button" onClick={() => setShowManualLocation(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                               <X size={16} />
                             </button>
                           </div>
                           
                           <div>
                             <select
                               value={manualState}
                               onChange={handleStateChange}
                               className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                             >
                               <option value="">Select State</option>
                               {INDIAN_STATES.map(st => (
                                 <option key={st} value={st}>{st}</option>
                               ))}
                             </select>
                           </div>

                           {manualState && (
                             <div className="relative">
                               <select
                                 value={manualCity}
                                 onChange={(e) => setManualCity(e.target.value)}
                                 disabled={isLoadingCities}
                                 className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 disabled:opacity-50"
                               >
                                 <option value="">Select City / District</option>
                                 {availableCities.map((city, idx) => (
                                   <option key={idx} value={city}>{city}</option>
                                 ))}
                               </select>
                               {isLoadingCities && (
                                 <Loader2 size={16} className="absolute right-3 top-3 animate-spin text-gray-400" />
                               )}
                             </div>
                           )}

                           <input
                             type="text"
                             value={manualPlace}
                             onChange={(e) => setManualPlace(e.target.value)}
                             placeholder="Exact Place (e.g., Main Street, Near Park)"
                             className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                           />
                           
                           <input
                             type="text"
                             value={manualPostal}
                             onChange={(e) => {
                               const val = e.target.value.replace(/\D/g, '');
                               if (val.length <= 6) setManualPostal(val);
                             }}
                             placeholder="Postal Code (6 digits)"
                             className="w-full p-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                             maxLength={6}
                           />

                           <button
                             type="button"
                             onClick={submitManualLocation}
                             className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                           >
                             Confirm Location
                           </button>
                         </div>
                       ) : (
                         <div className="space-y-3">
                           <button
                             type="button"
                             onClick={handleGetLocation}
                             disabled={isLocating}
                             className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors disabled:opacity-70"
                           >
                             {isLocating ? (
                               <>
                                 <Loader2 size={18} className="animate-spin" />
                                 <span>Acquiring location...</span>
                               </>
                             ) : (
                               <>
                                 <MapPin size={18} />
                                 <span>Use Current Location</span>
                               </>
                             )}
                           </button>
                           <button
                             type="button"
                             onClick={() => setShowManualLocation(true)}
                             className="w-full text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline text-center py-1"
                           >
                             Enter location manually
                           </button>
                         </div>
                       )}
                       {locationError && (
                         <div className="flex items-center gap-1.5 mt-2 text-sm text-red-600">
                           <AlertCircle size={14} />
                           <span>{locationError}</span>
                         </div>
                       )}
                     </div>

                     {/* Description Section */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Description <span className="text-red-500">*</span>
                       </label>
                       <textarea
                         value={description}
                         onChange={(e) => setDescription(e.target.value)}
                         placeholder="Describe the issue (Required)..."
                         className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 text-gray-900 dark:text-gray-100 outline-none transition-all resize-none h-28"
                       />
                     </div>

                     {submitError && (
                       <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                         <AlertCircle size={16} className="mt-0.5 shrink-0" />
                         <p>{submitError}</p>
                       </div>
                     )}

                     {/* Submit Button */}
                     <button
                       type="submit"
                       disabled={isSubmitting || !imagePreview || !description || !location}
                       className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                     >
                       {isSubmitting ? (
                         <Loader2 size={20} className="animate-spin" />
                       ) : (
                         <>
                           <Send size={18} />
                           <span>Submit Report</span>
                         </>
                       )}
                     </button>
                   </motion.form>
                 )}
               </AnimatePresence>
             </div>
           </div>
        ) : activeTab === 'feed' ? (
           <FeedTab 
             isFetchingFeed={isFetchingFeed}
             myIssues={myIssues}
             neighborIssues={neighborIssues}
             IssueCard={IssueCard}
             handleLike={handleLike}
             activeCommentIssueId={activeCommentIssueId}
             setActiveCommentIssueId={setActiveCommentIssueId}
             commentText={commentText}
             setCommentText={setCommentText}
             Loader2={Loader2}
           />
        ) : activeTab === 'contacts' ? (
           <div className="space-y-6">
              <ContactsView location={location} />
           </div>
        ) : activeTab === 'chat' ? (
           <div className="space-y-6">
              <NeighborhoodChat user={user} />
           </div>
        ) : activeTab === 'games' ? (
           <div className="space-y-6">
              <GamesTab user={user} setUser={setUser} />
           </div>
        ) : activeTab === 'profile' ? (
           <ProfileTab 
             user={user}
             setUser={setUser}
             onLogout={onLogout} 
           />
        ) : activeTab === 'dashboard' ? (
           <div className="space-y-6 pb-20">
              <Dashboard user={user} myIssues={myIssues} />
           </div>
        ) : null}
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 size={20} className="shrink-0" />
              <span>{notification}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-[32px] p-2 flex gap-1 pointer-events-auto">
          <button 
            onClick={() => setActiveTab('report')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${activeTab === 'report' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <PlusCircle size={22} className={activeTab === 'report' ? '' : 'opacity-80'} />
            <span className="text-[9px] font-bold mt-1 tracking-wide">Report</span>
          </button>
          <button 
            onClick={() => setActiveTab('feed')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${activeTab === 'feed' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <List size={22} className={activeTab === 'feed' ? '' : 'opacity-80'} />
            <span className="text-[9px] font-bold mt-1 tracking-wide">Feed</span>
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <MessageCircle size={22} className={activeTab === 'chat' ? '' : 'opacity-80'} />
            <span className="text-[9px] font-bold mt-1 tracking-wide">Chat</span>
          </button>
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${activeTab === 'contacts' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <PhoneCall size={22} className={activeTab === 'contacts' ? '' : 'opacity-80'} />
            <span className="text-[9px] font-bold mt-1 tracking-wide">Contacts</span>
          </button>
          <button 
            onClick={() => setActiveTab('games')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${activeTab === 'games' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Gamepad2 size={22} className={activeTab === 'games' ? '' : 'opacity-80'} />
            <span className="text-[9px] font-bold mt-1 tracking-wide">Games</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 overflow-hidden border ${activeTab === 'profile' ? 'border-white bg-blue-500' : 'border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700'}`}>
               <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[9px] font-bold tracking-wide">Profile</span>
          </button>
        </div>
      </div>

      <CivicAIChat user={user} />

      <AnimatePresence>
        {showDailyQuizPrompt && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
              <div className="flex justify-between items-center mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full text-orange-600 dark:text-orange-400">
                  <Trophy size={28} />
                </div>
                <button 
                  onClick={() => setShowDailyQuizPrompt(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Daily Quiz Ready!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Log in and play the daily hard quiz to earn <span className="font-bold text-orange-600 dark:text-orange-400">+5 points</span>! It only takes a minute.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDailyQuizPrompt(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors"
                >
                  Later
                </button>
                <button 
                  onClick={() => {
                    setShowDailyQuizPrompt(false);
                    setActiveTab('games');
                  }}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition-colors"
                >
                  Play Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
