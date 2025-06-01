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
    <div className={styles.userDetail}>
      <div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Personal Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.label}>Full Name</div>
            <div className={styles.value}>{user.name}</div>

            <div className={styles.label}>Username</div>
            <div className={styles.value}>{user.username}</div>

            <div className={styles.label}>Email</div>
            <div className={styles.value}>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </div>

            <div className={styles.label}>Phone</div>
            <div className={styles.value}>{user.phone}</div>

            <div className={styles.label}>Website</div>
            <div className={styles.value}>
              <a
                href={`http://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.website}
              </a>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Company</h3>
          <div className={styles.infoGrid}>
            <div className={styles.label}>Name</div>
            <div className={styles.value}>{user.company.name}</div>

            <div className={styles.label}>Catchphrase</div>
            <div className={styles.value}>{user.company.catchPhrase}</div>

            <div className={styles.label}>Business</div>
            <div className={styles.value}>{user.company.bs}</div>
          </div>
        </div>
      </div>

      <div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Address</h3>
          <div className={styles.infoGrid}>
            <div className={styles.label}>Street</div>
            <div className={styles.value}>{user.address.street}</div>

            <div className={styles.label}>Suite</div>
            <div className={styles.value}>{user.address.suite}</div>

            <div className={styles.label}>City</div>
            <div className={styles.value}>{user.address.city}</div>

            <div className={styles.label}>Zipcode</div>
            <div className={styles.value}>{user.address.zipcode}</div>

            <div className={styles.label}>Geo Coordinates</div>
            <div className={styles.value}>
              Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}
              <div>
                <a
                  href={getGoogleMapsUrl(
                    user.address.geo.lat,
                    user.address.geo.lng
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
