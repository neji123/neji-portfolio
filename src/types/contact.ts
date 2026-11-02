export type ContactChannels = {
  email: string;
  linkedin: string;
  github: string;
  cv: string;
  whatsapp: {
    /** International format, digits only, as wa.me expects it. */
    number: string;
    /** How the number is written for people. */
    display: string;
  };
};
