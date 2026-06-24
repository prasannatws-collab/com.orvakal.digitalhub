import { Alert } from 'react-native';
import * as Location from 'expo-location';
import type { ILocationService, Coordinates } from '../../domain/services/ILocationService';

export class ExpoLocationService implements ILocationService {
  async getCurrentLocation(lang: 'en' | 'te' | 'hi' = 'en'): Promise<Coordinates | null> {
    try {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

      if (existingStatus !== 'granted') {
        const text = {
          en: {
            title: "Location Access Required",
            message: "Orvakal Digital Hub requires location access to find and sort the nearest local resources (like banks, ATMs, hospitals, post offices, and mechanics) relative to you. Your coordinates are processed entirely on-device and are never stored or uploaded.",
            cancel: "Cancel",
            continue: "Continue"
          },
          te: {
            title: "స్థాన అనుమతి అవసరం",
            message: "సమీపంలోని సేవలు (బ్యాంకులు, ఆసుపత్రులు, పోస్ట్ ఆఫీస్, మెకానిక్స్ మొదలైనవి) దూరాన్ని లెక్కించడానికి మరియు క్రమబద్ధీకరించడానికి ఈ యాప్‌నకు జీపీఎస్ (స్థాన) అనుమతి అవసరం. ఈ వివరాలు మీ పరికరంలోనే భద్రంగా ప్రాసెస్ చేయబడతాయి మరియు ఏ సర్వర్‌కు పంపబడవు.",
            cancel: "రద్దు చేయి",
            continue: "కొనసాగించు"
          },
          hi: {
            title: "स्थान अनुमति की आवश्यकता है",
            message: "ओरवाकल डिजिटल हब को आपके निकटतम बैंकों, एटीएम, अस्पतालों, डाकघरों और मैकेनिकों की दूरी की गणना करने और उन्हें व्यवस्थित करने के लिए स्थान अनुमति की आवश्यकता है। आपकी स्थिति केवल आपके डिवाइस पर संसाधित की जाती है और कभी भी सहेजी या अपलोड नहीं की जाती है।",
            cancel: "रद्द करें",
            continue: "आगे बढ़ें"
          }
        }[lang] || {
          title: "Location Access Required",
          message: "Orvakal Digital Hub requires location access to find and sort the nearest local resources (like banks, ATMs, hospitals, post offices, and mechanics) relative to you. Your coordinates are processed entirely on-device and are never stored or uploaded.",
          cancel: "Cancel",
          continue: "Continue"
        };

        const userApproved = await new Promise<boolean>((resolve) => {
          Alert.alert(
            text.title,
            text.message,
            [
              {
                text: text.cancel,
                style: "cancel",
                onPress: () => resolve(false)
              },
              {
                text: text.continue,
                onPress: () => resolve(true)
              }
            ],
            { cancelable: false }
          );
        });

        if (!userApproved) {
          return null;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return null;
        }
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      };
    } catch (error) {
      console.warn('Error fetching location:', error);
      return null;
    }
  }

  calculateDistance(from: Coordinates, to: Coordinates): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(to.latitude - from.latitude);
    const dLon = toRad(to.longitude - from.longitude);
    const lat1 = toRad(from.latitude);
    const lat2 = toRad(to.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // returns distance in km
  }
}
