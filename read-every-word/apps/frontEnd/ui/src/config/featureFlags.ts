interface FeatureFlags {
  enableJournal: boolean;
  enableMemorize: boolean;
  enablePray: boolean;
}

const devFlags: FeatureFlags = {
  enableJournal: false,
  enableMemorize: false,
  enablePray: false,
};

const prodFlags: FeatureFlags = {
  enableJournal: false,
  enableMemorize: false,
  enablePray: false,
};

export const featureFlags: FeatureFlags =
  import.meta.env.DEV ? devFlags : prodFlags;
