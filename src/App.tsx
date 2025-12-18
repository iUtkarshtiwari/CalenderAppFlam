import { Calendar } from './components/Calender';
import shortlinkConfig from './shortlink.config.json';

export default function App() {
     const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
 function openAAI() {

    // Build URL / deep link from shortlink.config.json
    const aaiConfig = shortlinkConfig.aai;

    const queryParams = new URLSearchParams({
      region: 'NR',
      project: 'Agra',
      projectName: 'Agra',
    }).toString();

    // Web URL from config
    const webUrl = `${aaiConfig.web.url}/${aaiConfig.web.path}?${queryParams}`;
    console.log(webUrl);
    // Mobile deep links from config
    const iosPath = aaiConfig.ios.path || aaiConfig.path;
    const androidPath = aaiConfig.path;

    const iosDeepLink = `${aaiConfig.ios.scheme}://${iosPath}?${queryParams}`;
    const androidDeepLink = `${aaiConfig.android.scheme}://${androidPath}?${queryParams}`;
    console.log('iosDeepLink', iosDeepLink);
    if(iosDeepLink) {
      alert(iosDeepLink);
    }
    console.log('androidDeepLink', androidDeepLink);
    if(androidDeepLink) {
      alert(androidDeepLink);
    }
    const userAgent = navigator.userAgent || '';
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
 
    // Prefer deep link on mobile, fall back to web URL on desktop.
    if (isAndroid) {
      // i want to see the link in the alert toast message section of the browser
      alert(androidDeepLink);
      // Alert.alert('androidDeepLink', androidDeepLink);
      window.location.href = androidDeepLink || webUrl;
    } else if (isIOS) {
      window.location.href = iosDeepLink || webUrl;
    } else {
      setIframeUrl(webUrl);
      setShowIframe(true);
    }
 }
  
  return (
    <div className="min-h-screen bg-sky-100 p-4">
      <Calendar />
      <button onClick={openAAI}>Open AAI Power BI Dashboard</button>
    </div>
  );
}

