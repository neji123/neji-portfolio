import { type Certification } from "@/types/certification";

// Publication of both certificate images is authorized by the owner; the ID number is already hidden on them.
export const certifications: readonly Certification[] = [
  {
    id: "ai-optimus",
    name: {
      en: "Professional Training Certificate in Artificial Intelligence",
      fr: "Certificat de formation professionnelle en intelligence artificielle",
      ar: "شهادة تدريب مهني في الذكاء الاصطناعي",
    },
    issuer: "Optimus Training",
    issued: "2026-06",
    proof: {
      kind: "image",
      image: { src: "/images/certificates/certificate-ai-optimus.png", width: 4734, height: 3364 },
      alt: {
        en: "Professional training certificate in artificial intelligence issued by Optimus Training to Mohamed Neji Benzarti",
        fr: "Certificat de formation professionnelle en intelligence artificielle délivré par Optimus Training à Mohamed Neji Benzarti",
        ar: "شهادة تدريب مهني في الذكاء الاصطناعي صادرة عن Optimus Training لمحمد الناجي البنزرتي",
      },
    },
  },
  {
    id: "tcf-b2",
    name: {
      en: "TCF Tout Public, Level B2 (CEFR)",
      fr: "TCF Tout Public, niveau B2 (CECRL)",
      ar: "اختبار TCF Tout Public، المستوى B2 (الإطار الأوروبي المرجعي)",
    },
    issuer: "France Éducation International",
    issued: "2026-01",
    proof: {
      kind: "image",
      image: { src: "/images/certificates/tcf-b2.png", width: 1653, height: 2339 },
      alt: {
        en: "TCF Tout Public attestation from France Éducation International showing French level B2",
        fr: "Attestation TCF Tout Public de France Éducation International indiquant le niveau B2 en français",
        ar: "شهادة TCF Tout Public من France Éducation International تثبت مستوى B2 في اللغة الفرنسية",
      },
    },
  },
  {
    id: "ccna",
    name: "Cisco CCNA: Switching, Routing, and Wireless Essentials",
    issuer: "Cisco",
    proof: {
      kind: "credential",
      url: "https://www.credly.com/badges/312e7aad-e46d-46f1-8cb4-97831eddbc35",
    },
  },
];
