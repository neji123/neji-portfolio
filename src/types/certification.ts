import { type ImageAsset, type IsoMonth, type Localized, type LocalizedText } from "./localized";

export type CertificationProof =
  | { kind: "image"; image: ImageAsset; alt: Localized<string> }
  /** Verified on a third-party site; `mark` is the short name set on the card, e.g. "CCNA". */
  | { kind: "credential"; url: string; mark: string };

export type Certification = {
  id: string;
  name: LocalizedText;
  issuer: string;
  issued?: IsoMonth;
  proof: CertificationProof;
};
