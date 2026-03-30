/*
 * Copyright (c) 2026 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// IntroductionPage
export const FR_INTRODUCTION = {
	TITLE: 'Introduction',
	QUALIFICATION_INTRO:
		"Bien que toutes les sources de données de la BGP contiennent des données ouvertes, l'accès aux données génomiques et cliniques sensibles est contrôlé et nécessite une autorisation. Pour être admissible à la demande d'accès, vous devez:",
	QUALIFICATION_ITEMS: [
		"être un chercheur indépendant affilié ou une chercheuse indépendante affiliée à une entité juridique (p. ex. professeur/professeure d'université, chercheur/chercheuse dans une entreprise privée, chercheur indépendant/chercheuse indépendante admissible à des subventions fédérales de recherche, etc.);",
		'avoir un ou une représentant(e) institutionnel(le) au sein de votre établissement;',
		"fournir un résumé scientifique et un résumé vulgarisé décrivant l'utilisation prévue des données contrôlées de la BGP;",
		"avoir au moins trois publications admissibles dont vous êtes l'auteur/autrice ou le coauteur/coautrice;",
		"inclure une lettre d'un comité d'éthique confirmant que l'utilisation des données contrôlées de la BGP a été approuvée si une approbation éthique est requise dans votre pays ou région, ou confirmant qu'une telle approbation est exemptée dans votre pays ou région.",
	],
	RECEIVE_ACCESS_INTRO: "Pour obtenir l'accès, vous devez:",
	RECEIVE_ACCESS_ITEMS: [
		'remplir toutes les sections requises du présent formulaire de demande et en accepter les modalités;',
		"faire signer la demande finalisée par le chercheur principal/la chercheuse principale et le ou la représentant(e) institutionnel(e) de l'entité juridique de votre établissement;",
		"faire signer l'Entente d'utilisation des données par le chercheur principal/la chercheuse principale et le ou la représentant(e) institutionnel(le);",
		"soumettre la demande signée pour examen par le Bureau de conformité de l'accès aux données (BCAD) dans la section « Signer et soumettre » de la présente demande.",
		"Au cours du processus de demande, vous devez soumettre un résumé de votre projet de recherche. Votre projet sera évalué afin de vérifier sa conformité aux objectifs et aux politiques du PCGL, y compris, sans s'y limiter, aux politiques relatives à la finalité et à la pertinence de la recherche, à la protection des donneurs et à la sécurité des données des donneurs. Si votre demande est approuvée, vous acceptez que le nom du demandeur ou de la demandeuse, l'établissement et le résumé scientifique vulgarisé puissent être inscrits dans un registre public des projets ayant obtenu l'accès aux données contrôlées de la BGP.",
	],
	APPROVAL_AND_RENEWAL_PARAGRAPH:
		"Si le Comité d'accès aux données (CAD) approuve votre demande, l'accès aux données contrôlées de la BGP sera accordé à compter de la date d'approbation. Le demandeur doit conclure une entente d'une durée d'un an. Pour accéder aux données contrôlées ou les utiliser au-delà de cette période d'un an, une demande de renouvellement devra être soumise et approuvée par le CAD.",
};

// Appendices Page
export const FR_APPENDICES = {
	TITLE: 'Appendices',
	DESCRIPTION: 'Please review and agree to the following Appendices.',
	PCGL_POLICIES_TITLE: 'PCGL Policies',
	APPENDIX_I: 'You have read APPENDIX I — PCGL Goals and Policies',
	APPENDIX_II: 'You have read APPENDIX II — Data Access and Data Use Policies and Guidelines',
	APPENDIX_III: 'You have read APPENDIX III — Intellectual Property Policy',
};

// ApplicantInformation Page
export const FR_APPLICANT_INFORMATION = {
	TITLE: 'Renseignements sur le demandeur (chercheur principal)',
	QUALIFIED_APPLICANTS_PARAGRAPH:
		"Les demandeurs admissibles à l'accès aux données contrôlées de la BGP doivent être des chercheurs indépendants affiliés ou des chercheuses indépendantes affiliées à une entité juridique (p. ex. professeur/professeure d'université, chercheur/chercheuse dans une entreprise privée, chercheur indépendant/chercheuse indépendante admissible à des subventions fédérales de recherche, etc.).",
	INSTITUTIONAL_EMAIL_PARAGRAPH:
		'Veuillez fournir une adresse courriel institutionnelle valide qui sera utilisée pour vous connecter à la BGP et qui sera associée à votre accès aux données contrôlées de la BGP.',
	PRINCIPAL_INVESTIGATOR_INFO_TITLE: 'Principal Investigator Information',
	INSTITUTION_MAILING_ADDRESS_TITLE: 'Institution/Company Mailing Address',
	TITLE_LABEL: 'Title',
	FIRST_NAME_LABEL: 'First Name',
	MIDDLE_NAME_LABEL: 'Middle Name',
	LAST_NAME_LABEL: 'Last Name',
	SUFFIX_LABEL: 'Suffix',
	PRIMARY_AFFILIATION_LABEL: 'Primary Affiliation',
	INSTITUTIONAL_EMAIL_LABEL: 'Institutional Email',
	RESEARCHER_PROFILE_LABEL: 'Researcher Profile',
	POSITION_TITLE_LABEL: 'Position Title',
	COUNTRY_LABEL: 'Country',
	STREET_ADDRESS_LABEL: 'Street Address',
	BUILDING_LABEL: 'Building',
	PROVINCE_LABEL: 'Province',
	CITY_LABEL: 'City',
	POSTAL_CODE_LABEL: 'Postal Code / ZIP Code',
};

// Collaborators Page
export const FR_COLLABORATORS = {
	TITLE: 'Collaborateurs et collaboratrices',
	DESCRIPTION:
		'Veuillez inclure les noms de tous les chercheurs et chercheuses, collaborateurs et collaboratrices, membres du personnel de recherche (y compris les stagiaires postdoctoraux) et étudiants et étudiantes (y compris celles et ceux aux cycles supérieurs) qui auront accès aux données contrôlées de la BGP afin de travailler sur le résumé de recherche décrit à la section D de la présente demande.',
	NOT_REQUIRED: 'Les collaboratrices et collaborateurs ne sont pas requis pour que votre demande soit approuvée.',
	NOTE: "* Veuillez noter : les cochercheurs et cochercheuses, collaborateurs et collaboratrices ou étudiants et étudiantes provenant d'autres établissements ne doivent pas être inclus/es dans cette liste. Ils devront soumettre une demande distincte pour obtenir l'accès aux données contrôlées.",
};

// EndOfDocument Page
export const FR_END_OF_DOCUMENT = {
	TITLE: '—  END OF DOCUMENT  —',
	CLOSING_MESSAGE: 'Attached Ethics Letter and Appendices to follow.',
};

// Ethics Page
export const FR_ETHICS = {
	TITLE: 'Ethics',
	ETHICS_AWARENESS_PARAGRAPH:
		'PCGL is aware that some countries/regions do not require ethics approval for use of coded data (i.e. use of the PCGL Controlled Data). Depending on the nature of your research project, it is possible, however, that such approval is needed in your country. If you are uncertain as to whether your research project needs ethics approval to use PCGL Controlled Data, we suggest you contact your local institutional review board / research ethics committee (IRB/REC) to clarify the matter.',
	DACO_RESPONSIBILITY_PARAGRAPH:
		"Please note: The PCGL DACO and the PCGL are not responsible for the ethics approval/monitoring of individual research projects and bear no responsibility for the applicant's failure to comply with local/national ethical requirements.",
	ETHICS_APPROVAL_TITLE: 'Ethics Approval',
	NO_REVIEW_REQUIRED:
		'You represent and warrant that your country/region does not require your research project to undergo ethics review. An ethics exemption letter has been uploaded',
	REVIEW_REQUIRED:
		'Your country/region requires your Research Project to undergo ethics review, and therefore, this research project has been approved by an IRB/REC formally designated to approve and/or monitor research involving humans. As per the Data Access Agreement (see Section F) current and applicable ethical approval is the responsibility of the Principal Investigator',
	APPROVAL_LETTER_MESSAGE_APPROVAL: '—  Ethics approval letter is attached at end of this document.  —',
	APPROVAL_LETTER_MESSAGE_EXEMPTION: '—  Ethics exemption letter is attached at end of this document.  —',
};

// InstitutionalRepresentative Page
export const FR_INSTITUTIONAL_REPRESENTATIVE = {
	TITLE: 'Représentant(e) institutionnel(le)',
	DESCRIPTION:
		"Un ou une représentant(e) institutionnel(le) est un représentant qualifié d'une entité juridique ayant le pouvoir administratif d'engager légalement cette entité aux modalités et conditions énoncées à la section G : Entente d'accès aux données (p. ex. vice-président/présidente à la recherche, directeur/directrice de la recherche ou agent des contrats de l'entité). La signature du ou de la représentant(e) institutionnel(le) sera requise à la fin de la présente demande avant son examen par le BCAD de la BGP.",
	INSTITUTIONAL_REP_TITLE_LABEL: 'Institutional Representative',
	INSTITUTION_MAILING_ADDRESS_TITLE: 'Institution/Company Mailing Address',
	TITLE_LABEL: 'Title',
	FIRST_NAME_LABEL: 'First Name',
	MIDDLE_NAME_LABEL: 'Middle Name',
	LAST_NAME_LABEL: 'Last Name',
	SUFFIX_LABEL: 'Suffix',
	PRIMARY_AFFILIATION_LABEL: 'Primary Affiliation',
	INSTITUTIONAL_EMAIL_LABEL: 'Institutional Email',
	RESEARCHER_PROFILE_LABEL: 'Researcher Profile',
	POSITION_TITLE_LABEL: 'Position Title',
	COUNTRY_LABEL: 'Country',
	STREET_ADDRESS_LABEL: 'Street Address',
	BUILDING_LABEL: 'Building',
	PROVINCE_LABEL: 'Province',
	CITY_LABEL: 'City',
	POSTAL_CODE_LABEL: 'Postal Code / ZIP Code',
};

// ProjectInformation Page
export const FR_PROJECT_INFORMATION = {
	TITLE: 'Renseignements sur le projet',
	DESCRIPTION:
		"Veuillez remplir les détails suivants pour votre projet de recherche, y compris l'URL du site web si disponible.",
	PROJECT_TITLE_LABEL: 'Titre du projet',
	PROJECT_WEBSITE_LABEL: 'Site web du projet',
	RESEARCH_SUMMARY_TITLE: 'Résumé de la recherche - Résumé scientifique',
	RESEARCH_SUMMARY_DESCRIPTION:
		"Cette section doit décrire le contexte, les objectifs et la méthodologie de votre projet de recherche, ainsi que les plans d'utilisation des données contrôlées de la BGP.",
	PROJECT_BACKGROUND_LABEL: 'Contexte :',
	USE_OF_DATA_METHODOLOGY_LABEL: 'Utilisation des données et méthodologie :',
	AIMS_LABEL: 'Objectifs :',
	LAY_SUMMARY_TITLE: 'Résumé vulgarisé du projet',
	LAY_SUMMARY_LABEL: 'Résumé vulgarisé (Lay Summary) :',
	PUBLICATIONS_TITLE: 'Publications pertinentes',
	PUBLICATIONS_DESCRIPTION:
		"Veuillez fournir au moins trois liens vers des publications pertinentes dont la ou le candidate/candidat est autrice/auteur ou coautrice/coauteur. Il doit s'agir de liens (URL) vers des sites de publication tels que pubmed.gov, biorxiv.org ou medrxiv.org.",
	PUBLICATION_LABEL: 'Publication',
};

// RequestedStudy Page
export const FR_REQUESTED_STUDY = {
	TITLE: 'Étude demandée',
	DESCRIPTION:
		"Pour aider le CAD à examiner votre demande d'accès aux données plus efficacement, veuillez sélectionner l'étude pour laquelle vous demandez l'accès. Vous pouvez consulter et choisir parmi les études disponibles sur le",
	STUDY_NAME_LABEL: 'Noms des études',
};

// SignSubmit Page
export const FR_SIGN_SUBMIT = {
	TITLE: 'Signer et soumettre',
	SIGNATURE_REQUIREMENT:
		'Vous devez inclure à la fois la signature du chercheur principal/de la chercheuse principale et celle du ou de la représentant(e) institutionnel(le) pour que votre demande soit examinée. Le ou la représentant(e) institutionnel(le) sera également invité à soumettre sa signature lors de son examen.',
	APPLICANT_AUTHORIZATION_TITLE: 'Applicant Authorization',
	INSTITUTIONAL_REP_AUTHORIZATION_TITLE: 'Institutional Representative Authorization',
	NAME_LABEL: 'Name',
	PRIMARY_AFFILIATION_LABEL: 'Primary Affiliation',
	POSITION_TITLE_LABEL: 'Position Title',
};

// TitlePage
export const FR_TITLE_PAGE = {
	APPLICATION_NUMBER_LABEL: 'Application Number:',
	APPLICATION_NUMBER_PREFIX: 'PCGL-',
	PRINCIPAL_INVESTIGATOR_LABEL: 'Principal Investigator:',
	INSTITUTION_LABEL: 'Institution:',
	DOCUMENT_CREATED_ON_LABEL: 'Document Created On:',
	FRENCH_VERSION: '« Une version française est jointe en bas. »',
};

// DataAccessAgreement Page
export const FR_DATA_ACCESS_AGREEMENT = {
	TITLE: 'Data Access Agreement',
	APPLICATION_COMPLETION_PARAGRAPH:
		"This application form must be completed by the applicant and the legal entity with which you are affiliated (You) prior to being granted access to Pan Canadian Genome Library (PCGL) controlled data (the PCGL Controlled Data as further defined in Section F of this application). To receive access, You must complete this entire application form and agree to its terms by signing this application. All sections, as well as Appendices I through III, are integral components of this application. Your Research Project (as defined below) will be checked for conformity with the goals and policies of PCGL including, but not limited to, policies concerning the purpose and relevance of the research, the protection of the participants and the security of the participants' data.",
	DACO_APPROVAL_PARAGRAPH:
		'If the Data Access Compliance Office of the PCGL (the DACO), approves your application, access to the PCGL Controlled Data will be granted starting from the date You are approved for access.',
	PUBLIC_REGISTRY_PARAGRAPH:
		'If your application is approved, You agree that Your application information will be included in a public registry containing project details and lay summaries of the scientific abstracts of applicants having been granted access to PCGL Controlled Data.',
	AGREEMENT_ACKNOWLEDGEMENT_PARAGRAPH:
		'You agree you have read the DACO Policies and Procedures document prior to completing this application. This agreement governs the terms of access to the PCGL Controlled Data (further defined below). In signing this agreement, you agree to be bound by the terms and conditions of access set out therein.',
	DEFINITIONS_PARAGRAPH:
		"For the sake of clarity, the terms of access set out in this agreement apply to the User and to the User Institution(s) (as defined below). The current agreement is limited to the PCGL Controlled Data (as defined below) and does not cover other data generated at the different centres participating in the project. A list of PCGL members can be found on the PCGL website. Data Producer: An PCGL participating center, responsible for the development, organization, and oversight of a local database. Collaborator: A collaborator of the User, working for the same institution as the User Institution(s) (see below for definitions of User and User Institution(s)). PCGL Controlled Data: The Controlled Access Datasets of the library as defined in section E8.1 Data Access Framework of the Library's Policies and Guidelines. Publications: Includes, without limitation, articles published in print journals, electronic journals, reviews, books, posters and other written and verbal presentations of research. Research Participant: An individual having contributed their personal data to an PCGL project, also referred to as a Donor. User: An applicant (principal investigator), having signed this Data Access Agreement, whose User Institution has cosigned this Data Access Agreement, both of them having received acknowledgement of its acceptance. User Institution(s): Institution(s) at which the User is employed, affiliated or enrolled. A representative of it has cosigned this Data Access Agreement with the User and received acknowledgement of its acceptance.",
	DEFINITIONS_TITLE: 'Definitions',
	DEFINITIONS_ITEMS: [
		"Library: The Pan Canadian Genome Library, an initiative to unify Canada's genome sequencing efforts, aiming to harness the potential of genomic medicine and maintain Canada's leadership in genomic research.",
		'Data Producer: A PCGL participating center, responsible for the development, organization, and oversight of a local database.',
		'Collaborator: A collaborator of the User, working for the same institution as the User Institution(s) (see below for definitions of User and User Institution(s)).',
		"PCGL Controlled Data: The Controlled Access Datasets of the Library as defined in section E8.1 Data Access Framework of the Library's Policies and Guidelines.",
		'Publications: Includes, without limitation, articles published in print journals, electronic journals, reviews, books, posters and other written and verbal presentations of research.',
		'Research Participant: An individual having contributed their personal data to an PCGL project.',
		'User: An applicant (principal investigator), having signed this Data Access Agreement, whose User Institution has cosigned this Data Access Agreement, both of them having received acknowledgement of its acceptance.',
		'User Institution(s): Institution(s) at which the User is employed, affiliated or enrolled. A representative of it has cosigned this Data Access Agreement with the User and received acknowledgement of its acceptance.',
	],
};

// TermsAndConditions Page
export const FR_TERMS_AND_CONDITIONS = {
	TITLE: 'Terms and Conditions',
	SIGNING_INTRO: 'In signing this Agreement:',
	TERMS_ITEMS: [
		'The User and the User Institution(s) agree to use the PCGL Controlled Data in compliance with all PCGL Goals, Structures, Policies and Guidelines including section E. Ethics and Appendix I of this application.',
		'The User and the User Institution(s) agree to only use the PCGL Controlled Data for the objectives and analyses outlined in section D. Project Information.',
		'The User and the User Institution(s) assumes responsibility for maintaining appropriate Ethical approval (if so required). Ethical approval must be current for the duration of the approved Data Access Period.',
		'The User and the User Institution(s) agree to preserve, at all times, the confidentiality of the information and PCGL Controlled Data. In particular, they undertake not to use, or attempt to use the PCGL Controlled Data to compromise or otherwise infringe the confidentiality of information on Research Participants.',
		'The User and the User Institution(s) agree to protect the confidentiality of Research Participants in any research papers or publications that they prepare by taking all reasonable care to limit the possibility of identification.',
		'The User and the User Institution(s) agree not to link or combine the PCGL Controlled Data provided under this agreement to other information or archived data available in a way that could re-identify the Research Participants, even if access to that data has been formally granted to the User and the User Institution(s), or is freely available without restriction.',
		'The User and the User Institution(s) agree not to transfer or disclose the PCGL Controlled Data, in whole or part, or any material derived from the PCGL Controlled Data, to anyone not listed in section C. Collaborators of this application, except where prior written permission for such transfer or disclosure has been agreed to by the University. Should the User or the User Institution(s) wish to share the PCGL Controlled Data with an External Collaborator, the External Collaborator must complete a separate application for Access to the PCGL Controlled Data.',
		'The User and the User Institution(s) accept that the Consortium, the member institutions including producers, depositors or copyright holders, or the funders of the PCGL Controlled Data or any part of the PCGL Controlled Data supplied bear no responsibility for the further analysis or interpretation of these PCGL Controlled Data, over and above that published by the Consortium.',
		'The User and the User Institution(s) agree to follow the Fort Lauderdale Guidelines, the Toronto Statement, as well as the GA4GH Framework for Responsible Sharing of Genomic and Health-Related Data included as linked Appendix II of this application. This includes but is not limited to recognizing the contribution of the Consortium including an acknowledgement in all reports or publications resulting from the User and the User Institutions use of the PCGL Controlled Data.',
		'The User agrees to confirm as requested submit ongoing compliance with this agreement and its conditions each year on the anniversary of the approval date.',
		'The User agrees to submit a final report at the completion of the Data Access Period, or if a study is closed, upon request by the DACO Officer.',
		'The User and the User Institution(s) agree to follow the Consortium Publication Policy.',
		'The User and the User Institution(s) agree to destroy, remove or revoke access to any controlled data where they have been notified that consent has been withdrawn.',
		'The User and the User Institution(s) agree not to make intellectual property claims on the PCGL Controlled Data (including somatic mutations) and not to use intellectual property protection in ways that would prevent or block access to, or use of, any element of the PCGL Controlled Data, or conclusion drawn directly from the PCGL Controlled Data.',
		"The User and the User Institution(s) can elect to perform further research that would add intellectual and resource capital to the PCGL Controlled Data and decide to obtain intellectual property rights on these downstream discoveries. In this case, the User and the User Institution(s) agree to implement licensing policies that will not obstruct further research and to follow the U.S. National Institutes of Health's, Best Practices for the Licensing of Genomic Inventions or a similar national guideline that is in conformity with the OECD, Guidelines for the Licensing of the Genetic Inventions. These two policies (NIH and OECD) are included as part of the linked Appendix III of this application. ",
		'The User and the User Institution (s) shall implement and maintain, at its cost and expense, appropriate technical and organisational measures in relation to the processing of PCGL Controlled Data and Personal Information. The User will ensure that the security it implements in respect of Personal Information processed by it is appropriate to the risks that are presented by the processing, in particular from accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to Personal Information transmitted, stored or otherwise processed.',
		'The User and the User Institution(s) agree to destroy/discard any PCGL Controlled Data held, once it is no longer used for the project described in this application unless obligated to retain the PCGL Controlled Data for archival purposes in conformity with national audits or legal requirements.',
		'The User and the User Institution(s) will update the Section C. Collaborators to reflect any changes or departures in researchers, collaborators and personnel within 30 days of the changes made.',
		"The User and the User Institution(s) must notify the DACO prior to any significant changes to the Research Project's protocol of the User.",
		'The User and the User Institution(s) will notify the DACO as soon as they become aware of a breach of the terms or conditions of this agreement. All security incidents are to be reported without delay as outlined in the Data Breach Policy.',
		'The User and the User Institution(s) accept that this agreement may terminate upon any breach of this agreement from the User, the User Institution(s) or any authorized personnel mentioned in section C. Collaborators of this application. In this case, The User and the User Institution(s) will be required to destroy/discard any PCGL Controlled Data held, including copies and backup copies. This clause does not prevent the User and the User Institution(s) from retaining the PCGL Controlled Data for archival purposes in conformity with national audits or legal requirements.',
		'The User and the User Institution(s) accept that it may be necessary for the Consortium or its appointed agent to alter the terms of this agreement from time to time. In this event, the Consortium or its appointed agent will contact the User and the User Institution(s) to inform them of any changes. The revised terms shall be binding upon the User and the User Institution(s) upon notification to the User or the User Institution(s) or the continued use of the PCGL Controlled Data by the User or the User Institution(s) after any such revision.',
		'The User and the User Institution(s) agree to distribute a copy of this agreement and explain its content to any person mentioned in section C. Collaborators.',
		'The University as Data Controller (Regulation (EU) 2016/679 (General Data Protection Regulation) governs PCGL operations and management, including the DACO and Data Coordination Centre and associated Regional Data Processing Centres.',
	],
	AGREEMENTS_TITLE: 'Agreements',
	AGREEMENTS_INTRO: 'You MUST agree to the following procedures in order to have access to the PCGL Controlled Data:',
	SOFTWARE_UPDATES:
		'Yes, You will keep all computer systems on which PCGL Controlled Data reside, or which provide access to such data, up-to-date with respect to software patches and antivirus file definitions (if applicable).',
	NON_DISCLOSURE:
		'Yes, You will protect PCGL Controlled Data against disclosure to and use by unauthorized individuals.',
	MONITOR_INDIVIDUAL_ACCESS: 'Yes, You will monitor and control which individuals have access to PCGL controlled Data.',
	DESTROY_DATA:
		'Yes, You will securely destroy all copies of PCGL Controlled Data in accordance with the terms and conditions of the Data Access Agreement.',
	FAMILIARIZE_RESTRICTIONS:
		'Yes, You will familiarize all individuals who have access to PCGL Controlled Data with the restrictions on its use.',
	PROVIDE_IT_POLICY:
		'Yes, You agree to swiftly provide a copy of both your institutional and Research Project related IT policy documents upon request from a DACO representative.',
	NOTIFY_UNAUTHORIZED_ACCESS:
		'Yes, You will notify the DACO immediately if you become aware or suspect that someone has gained unauthorized access to the PCGL Controlled Data.',
	CERTIFY_APPLICATION:
		'Yes, You certify that the contents in the application are true and correct to the best of your knowledge and belief.',
	READ_AND_AGREED:
		'Yes, You have read and agree to abide by the terms and conditions outlined in the Data Access Agreement.',
};
