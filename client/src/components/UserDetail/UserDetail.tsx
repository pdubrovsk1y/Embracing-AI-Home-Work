import type { User } from "../../types/user";
import styles from "./UserDetail.module.css";

interface UserDetailProps {
  user: User;
}

export const UserDetail = ({ user }: UserDetailProps) => {
  const getGoogleMapsUrl = (lat: string, lng: string) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  return (
    <div className={styles.modalContent}>
      {/* Email Section */}
      <div className={styles.section}>
        <p className={styles.emailText}>{user.email}</p>
      </div>

      {/* Address Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Address</h3>
        <div className={styles.sectionContent}>
          <div>
            {user.address.street}, {user.address.suite}
          </div>
          <div>
            {user.address.city}, {user.address.zipcode}
          </div>
        </div>
        <a
          href={getGoogleMapsUrl(user.address.geo.lat, user.address.geo.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          📍 View on map
        </a>
      </div>

      <div className={styles.divider}></div>

      {/* Contact Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Contact</h3>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Phone:</span>
            <span>{user.phone}</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Website:</span>
            <a
              href={`http://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {user.website}
            </a>
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Company Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Company</h3>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Name:</span>
            <span>{user.company.name}</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Catchphrase:</span>
            <span>{user.company.catchPhrase}</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Business:</span>
            <span>{user.company.bs}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
