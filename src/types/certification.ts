import { type ImageAsset, type IsoMonth, type Localized, type LocalizedText } from "./localized";

export type CertificationProof =
  | { kind: "image"; image: ImageAsset; alt: Localized<string> }
  | { kind: "credential"; url: string };

export type Certification = {
  id: string;
  name: LocalizedText;
  issuer: string;
  issued?: IsoMonth;
  proof: CertificationProof;
};
