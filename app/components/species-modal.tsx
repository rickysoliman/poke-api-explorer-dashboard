import { SpeciesData } from "../types/pokemon";
import styles from "./species-modal.module.css";

interface SpeciesModalProps {
  pokemonName: string;
  speciesData: SpeciesData | null;
  isLoading: boolean;
  speciesError: string | null;
  onClose: () => void;
}

export default function SpeciesModal({
  pokemonName,
  speciesData,
  isLoading,
  speciesError,
  onClose,
}: SpeciesModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h3 className={styles.modalTitle}>Pokedex Entry for {pokemonName}</h3>

        {isLoading && (
          <p className={styles.loadingMessage}>Loading Pokedex details...</p>
        )}

        {speciesError && <p className={styles.speciesError}>{speciesError}</p>}

        {speciesData && (
          <>
            <p className={styles.speciesEntry}>{speciesData.pokedexEntry}</p>
            <div className={styles.speciesDetails}>
              <p className={styles.speciesDetail}>
                <span className={styles.label}>Category:</span>{" "}
                {speciesData.genus}
              </p>
              <p className={styles.speciesDetail}>
                <span className={styles.label}>Color:</span>{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {speciesData.color}
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
