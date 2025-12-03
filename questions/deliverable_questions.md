# Deriverable Questions 
## Compliance Checklist for Manufacturers
- **Identify Role**: Have you clearly identified your role (manufacturer, authorised representative, importer, or distributor)?
  - Have you assigned a responsible person for the DoC and technical documentation?
  - Have you verified that subcontractors provide the necessary information?
- **Draft DoC**: Have you drafted the Declaration of Conformity (DoC) using the Annex V ( [check questions](set:eu-declaration-of-conformity-annex-5) ) model?
  - Have you signed the DoC?
  - Have you checked whether the PDE is subject to other Union legislation?
  - If yes, have you prepared a single combined DoC?
  - Is the DoC available in a language accepted by the Member State where the PDE is placed on the market?
  - Is the DoC written in clear, readable language?
- **Build Technical Documentation**: Have you prepared complete technical documentation/file for the PDE?
  - Is the technical file stored in a language understandable to market surveillance authorities?
  - Have you ensured secure storage of the technical documentation?
  - Have you set up secure internal access management for the documentation?
- **Provide Access and Transparency**: Have you established a process to provide authorities with technical documentation upon request?
  - Have you prepared the required user information and instructions?
  - Have you verified that the information and instructions are clear to an average test group?
  - Do you supply a full or simplified DoC with the product, with a direct URL or QR code linking to the full version?
  - Can you provide information in all languages of destination market? 
- **Maintain and Distribute DoC**: Do you have processes in place to maintain and distribute the Declaration of Conformity (DoC)?
  - Do you regularly review and update the DoC?
  - Do you keep version control of the DoC?
  - Do you share the current DoC version with importers and distributors?
  - Do you maintain traceability records for DoC versions?
  - Can you provide the DoC promptly to market surveillance authorities upon request?
- **Keep Technical Documentation Up to Date**: Do you ensure the technical documentation is kept up to date?
  - Do you maintain a procedure for updates after significant hardware, firmware, or process changes?
  - Do you reflect all versions placed on the market and explain the changes between them?
  - Do you ensure traceability between product versions, tests, and risk assessments?
- **Review, Communicate and Record Compliance**: Do you regularly review, communicate, and record compliance?
  - Do you review the consistency between the DoC, technical documentation, and user information?
  - Do you communicate end-of-support information to users?
  - Do you maintain a compliance log (version history, responsible persons, review dates)?
## Technical Documentation
### General Description 
put-description: The Technical documentation of a product with digital elements shall contain a general description of the product with digital elements, including:
put-description: - its intended purpose;
put-description: - versions of software affecting compliance with essential cybersecurity requirements;
put-description: - where the product with digital elements is a hardware product, photographs or illustrations showing external features, marking and internal layout;
put-description: - user information and instructions
- **Intended Purpose & Intended Users**: Does the “general description” of the technical documentation contain the product’s intended purpose and who are its intended users?. 
    - info: ‘intended purpose’ means the use for which a product with digital elements is intended by the manufacturer, including the specific context and conditions of use, as specified in the information supplied by the manufacturer in the instructions for use, promotional or sales materials and statements, as well as in the technical documentation;
    - info: 
    - info: Example: Smart sensor for home use; connects via Wi-Fi; typical user: consumer.
    - info: Reference: Annex VII (1)(a)
- **Visual & Images for Product**: Does the “general description” of the technical documentation contain visuals or images to show the product and markings?
    - na: true
    - info: Example: Photo showing general hardware, CE mark, serial number, and model label.
    - info: Reference: Annex VII (1)(c)
- **Key Conditions & Limitations**: Does the “general description” of the technical documentation contain key conditions or limitations of use?
    - info: Example: Indoor use only; operating temperature 0–40 °C.
    - info: Reference: Annex VII (1)
- **Software & Firmware Versions Used**: Does the “general description” of the technical documentation contain information about the software or firmware versions are used in the product?
  - info: Example: Firmware v2.1.0; App v3.0.2.
  - info: Reference: Annex VII (1)(b)
- **Previous Software & Firmware Versions**: Does the “general description” of the technical documentation contain information about previous software or firmware versions that have been placed on the market and are still available to users?
  - na: true
  - info: Example: Firmware v1.1, sold until July 2027.
  - info: Reference: Annex VII (1)(b)
- **Version Identification in the Field**: Does the “general description” of the technical documentation contain information about how can each version of the product be identified in the field?
  - na: true
  - info: Example: Version shown in device interface; model number on label.
  - info: Reference: Annex VII (1)(b)
- **User Information & Instructions**: Does the “general description” of the technical documentation contain user information and instructions?
  - info: Example: User manual.
  - info: Reference: Annex VII (1)(d)

### Description of the Design, Development and Production
put-description: The Technical documentation of a product with digital elements shall contain a description of the design, development and production of the product with digital elements and vulnerability handling processes, including: 

put-description: - necessary information on the design and development of the product with digital elements, including, where applicable, drawings and schemes and a description of the system architecture explaining how software components build on or feed into each other and integrate into the overall processing; 
put-description: - necessary information and specifications of the vulnerability handling processes put in place by the manufacturer, including the software bill of materials, the coordinated vulnerability disclosure policy, evidence of the provision of a contact address for the reporting of the vulnerabilities and a description of the technical solutions chosen for the secure distribution of updates; 
put-description- necessary information and specifications of the production and monitoring processes of the product with digital elements and the validation of those processes; 
- **Design, Development & Production for Security**: Does the “description of the design, development and production” contain how was the product designed, developed, and produced to include security?
  - info: Example: Description of secure design approach, architecture overview.
  - info: Reference: Annex VII (2)(a)
- **Vulnerability Handling Process**: Does the “description of the design, development and production” contain how do you handle vulnerabilities (intake, triage, remediation)?
  - info: Example: Coordinated vulnerability disclosure policy and process flow.
  - info: Reference: Annex VII (2)(b)
- **Component & Data Flow Documentation**: Does the “description of the design, development and production” contain how components and data flows are documented?
  - info: Example: SBOM in the case of software, HBOM in the case of hardware.
  - info: Reference: Annex VII (2)(b)
- **Security Update Process**: Does the “description of the design, development and production” contain how security updates are tested, signed, and distributed??
  - info: Example: Signed updates verified through digital signature checks.
  - info: Reference: Annex VII (2)(b)
- **Secure Manufacturing & Provisioning Steps**: Does the “description of the design, development and production” contain what secure manufacturing and provisioning steps are applied?
  - info: Example: Secure firmware installation, identity checks, integrity verification.
  - info: Reference: Annex VII (2)(c)
- **Monitoring & Validation Activities**: Does the “description of the design, development and production” contain what monitoring and validation activities are in place?
  - info: Example: Telemetry to detect update failures; incident tracking dashboard.
  - info: Reference: Annex VII (2)(c)
### Assessment of the Cybersecurity Risks 
put-description: The technical documentation shall include an assessment of the cybersecurity risks against which the product with digital elements is designed, developed, produced, delivered, and maintained. The risk assessment should be based upon the reasonable foreseeable use (will add info section on the app) and the intended purpose (will add info section on the app) of the product. This assessment shall describe: 

put-description: - the operational environment, conditions of use, and assets requiring protection; 
put-description: - the cybersecurity risks identified throughout the product’s lifecycle; 
put-description: - how the essential cybersecurity requirements set out in Part I of Annex I (will add info section the app) apply to the product; and 
put-description: - how those requirements are implemented as informed by the cybersecurity risk assessment. 

put-description: It shall also indicate how you apply Part I, point (1) of Annex I (will add info section on the app) and the vulnerability handling requirements set out in Part II of Annex I (will add info section on the app).  
- **Risk Assessment Method or Standard**: Does the “assessment of the cybersecurity risks” contain which method or standard was used for the risk assessment?
  - info: Example: ISO 27005, ENISA, or internal threat modelling.
  - info: Reference: Annex VII (3)
- **Risks, Threats, Impacts & Treatments**: Does the “assessment of the cybersecurity risks” contain the main risks, threats, impacts, and treatments identified?
  - info: Example: Data breach from unsecured Wi-Fi Access Point; Impact: high; Mitigation: encryption.
  - info: Reference: Annex VII (3)
- **Link Between Risks, Controls & Test Results**: Does the “assessment of the cybersecurity risks” contain how design risks are linked to design controls and test results?
  - info: Example: Risk-control-test matrix; mapping table.
  - info: Reference: Annex VII (3)
- **Residual Risks & Acceptance Rationale**: Does the “assessment of the cybersecurity risks” contain which residual risks remain and why they are acceptable?
  - info: Example: Denial-of-service risk accepted due to limited exposure.
  - info: Reference: Annex VII (3)
- **Applicable Essential Requirements (Annex I)**: Does the “assessment of the cybersecurity risks” contain which essential cybersecurity requirements from Annex I? ( [check questions](set:essential-cybersecurity-requirements-annex-1) ) CRA apply to the product?
  - info: Example: -- does not apply due to no wireless connection.
  - info: Reference: Annex VII (3)
### Support Period 
put-description: The technical documentation shall include the information that the manufacturer used to determine the support period for the product with digital elements. This information must reflect how long the product is expected to be in use and the factors the manufacturer considered when deciding an appropriate support period. This section should describe: 

put-description: - the expected time the product will remain in normal use; 
put-description: - the intended purpose and reasonably foreseeable use of the product

The information shall demonstrate that the chosen support period is proportionate, reflects real-world use, and is at least five years unless the product is expected to be used for a shorter period. 

- **Support Period Determination**: Does the “information for the support period” contain how the product’s support period was determined?
  - info: Example: Based on OS vendor support roadmap and internal policy.
  - info: Reference: Annex VII (4)
- **Declared Support Period**: Does the “information for the support period” contain the declared support period (dates or duration)?
  - info: Example: Security updates provided until 31 December 2030.
  - info: Reference: Annex VII (4)
- **Support Period Communication**: Does the “information for the support period” contain where the support period is communicated to users??
  - info: Example: On website, packaging, or in product interface.
  - info: Reference: Annex VII (4)
- **Support Period ↔ Risk Assessment Link**: Does the “information for the support period” contain how the support period links to the risk assessment and update plan??
  - info: Example: Risk analysis shows update relevance through lifecycle.
  - info: Reference: Annex VII (4)

### Harmonised Standards 
put-description: The technical documentation shall include a list of the harmonised standards, common specifications, or European cybersecurity certification schemes that you applied to meet the essential cybersecurity requirements. This section should describe: 

put-description: - which harmonised standards were used (full or partial application); 
put-description: - which parts of a standard or specification were applied, if only certain sections were used; 
put-description: - which common specifications or European cybersecurity certification schemes were followed; 
put-description: - how these standards or solutions support compliance with Parts I and II of Annex I ( [check questions](set:essential-cybersecurity-requirements-annex-1) )(will add info section on the app). 

put-description: If any standard or specification was only applied partially, the documentation must clearly identify which parts were used and how they contribute to meeting the essential cybersecurity requirements. 

- **Standards or Specifications Demonstrating Conformity**: Does the “list of applied standards and specifications” contain which standards or specifications demonstrate conformity?
  - info: Example: ISO/IEC 27001.
  - info: Reference: Annex VII (5)
- **Version Numbers & Publication Dates of Standards**: Does the “list of applied standards and specifications” contain the version numbers and publication dates of those standards?
  - info: Example: ISO/IEC 27001:2022.
  - info: Reference: Annex VII (5)
- **Certificates or Attestations Supporting Conformity**: Does the “list of applied standards and specifications” contain which certificates or attestations support conformity?
  - info: Example: CE certificate, cybersecurity scheme statement.
  - info: Reference: Annex VII (5)
- **Standards & Controls Cross-Reference**: Does the “list of applied standards and specifications” contain how the listed standards and controls link to Annex I requirements([check questions](set:essential-cybersecurity-requirements-annex-1))? 
  - info: Example: Cross-reference table between requirements and controls.
  - info: Reference: Annex VII (5)
### Reports of The Tests 
put-description: The technical documentation shall include the reports of the tests carried out to verify the conformity of the product with digital elements and the vulnerability handling processes with the essential cybersecurity requirements. These reports must show that the product and its associated processes meet the requirements set out in Parts I and II of Annex I ([check questions](set:essential-cybersecurity-requirements-annex-1)). This section should describe: 
put-description: - the tests performed on the product along with the methods, tools, and procedures used to verify conformity; 
put-description: - the tests performed on the vulnerability handling processes; 
put-description: - the evidence above should demonstrate that the essential cybersecurity requirements have been met from Annex I Parts I and II;  ([check questions](set:essential-cybersecurity-requirements-annex-1))
- **Tests Performed for Conformity**: Does the “test reports for conformity” contain what tests were performed to verify compliance with Annex I?
  - info: Example: penetration testing, code review, vulnerability scan.
  - info: Annex VII(6) 
- **Test Execution Details**: Does the “test reports for conformity” contain who performed the tests, when they were performed, and on which version?
  - info: Example: CyberLab EU, March 2025, firmware v2.1.
  - info: Annex VII(6) 
- **Test Configurations, Results & Outcomes**: Does the “test reports for conformity” contain the test configurations, results, and outcomes?
  - info: Example: pass/fail summary, test case references, reproducibility details.
  - info: Annex VII(6) 
- **Remediation Actions & Residual Risks**: Does the “test reports for conformity” contain what remediation actions were taken and what residual risks remain?
  - info: Example: patch v2.1.1 mitigated buffer overflow issue.
  - info: Annex VII(6) 
- **Version Control & Traceability of Test Reports**: Does the “test reports for conformity” contain how the test reports are version-controlled and linked to product builds?
  - info: Example: report versioned per release; signed approval by Quality Assurance lead.
  - info: Annex VII(6) 

### EU Declaration of Conformity
put-description: The technical documentation shall include a copy of the EU Declaration of Conformity for the product with digital elements. This document confirms that the product complies with the relevant provisions of the regulation and any other applicable Union legislation. This section should include: 

put-description: - the complete and signed EU Declaration of Conformity; 

put-description: The declaration must be the final version provided to users or authorities and must match the product and version documented elsewhere in the technical file. 
- **Completed & Signed EU Declaration of Conformity**: Does the “EU declaration of conformity” contain a completed and signed EU Declaration of Conformity?
  - info: Point to the question set about the EU Declaration.
  - info: Annex VII(7)

## Information and Instructions to the User
### Manufacturer Identification Details
put-description: This section requires providing the manufacturer’s complete identification details. It must include the official name, registered trade name or trademark, and full contact information such as postal address, email or other digital contact, and—where available—the manufacturer’s website.
put-description: These details ensure that users and market operators can clearly identify and contact the manufacturer when needed.
- **Registered Name or Trademark**: Does the "Manufacturer Identification Details" contain your name, registered trade name or registered trademark?
  - info: Example: SmartHome Tech BV
  - info: Reference: Annex II, 1 CRA
- **Postal Address**: Does the "Manufacturer Identification Details" contain your postal address?
  - info: Example: Rue de l’Innovation 12, 1000 Brussels (BE)
  - info: Reference: Annex II, 1 CRA
- **Digital Contact**: Does the "Manufacturer Identification Details" contain your email address or other digital contact?
  - info: Example: support@smarthometech.eu
  - info: Reference: Annex II, 1 CRA
- **Website Contact Point**: Does the "Manufacturer Identifacation Details" contain the website at which you can be contacted (if any)?
  - na: true
  - info: Example: www.smarthometech.be
  - info: Reference: Annex II, 1 CRA
### Product Identification Information
put-description: This section requires specifying the name, type, and any additional details necessary to uniquely identify the product with digital elements.
put-description: Such information ensures that the exact model, version, or variant of the product can be unmistakably distinguished from others in the manufacturer’s portfolio or on the market.
- **Product Name**: Does the "Product Identification Information" contain the product name?
  - info: Example: SmartSensor S2
  - info: Reference: Annex II, 3 CRA
- **Product Type**: Does the "Product Identification Information" contain the product type?
  - info: Example: Smart Sensor
  - info: Reference: Annex II, 3 CRA
- **Additional Identification Info**: Does the "Product Identification Information" contain any additional information enabling unique identification of the PDE?
  - info: Example: Released in 2025
  - info: Reference: Annex II, 3 CRA
- **Unique Identifier of the PDE**: Does the "product Identification Information" contain the unique identifier of the PDE?
  - info: Example: SS2-EU-2025-001
  - info: Reference: Annex II, 3 CRA
### Placement of Product Identification Markings
put-description: Manufacturers must ensure that each product with digital elements includes a type, batch, serial number, or any other element that allows for its clear identification. If such marking cannot be placed directly on the product, the information must instead be provided on the packaging or in accompanying documentation. This ensures reliable traceability of each product version placed on the market.
- **Location of Identifiers**: Have you determined and included, in the "Placement of Product Identification Markings", where can the user find these unique identifiers on the physical product?
  - info: Example: The serial number is located on a label on the back of the device
  - info: Reference: Article 13 (15) CRA ( was wrong on the deliverable)
- **Physical Marking on Each Unit**: Have you determined, regarding "Placement of Product Identification", the marking will you apply to each individual PDE unit to make it uniquely identifiable?
  - info: Example: Serial number, QR code, barcode
  - info: Reference: Annex 13 (15)
### Single Point of Contact
put-description: Manufacturers must provide a clearly defined point of contact where users, researchers, and authorities can report vulnerabilities and receive related information, as well as access the manufacturer’s coordinated vulnerability disclosure (CVD) policy.
- **Single Point of Contact (SPOC)**: Have you determined and included, in "Single Point of Contact", what is your single point of contact?
  - info: Example: Report vulnerabilities to security@smarthometech.eu. CVD policy: www.smarthometech.be/security
  - info: Reference: Annex II, 2 CRA
### Intended Purpose & Security Characteristics 
put-description: This section specifies the intended purpose/applications of the product with digital elements, including the security environment established by the manufacturer. It must also outline the product’s essential functionalities and describe its key security properties, ensuring users and authorities understand the product’s capabilities and expected secure operating conditions.
- **Primary Functions & Features**: Does the "Intended Purpose & Security Characteristics" contain which are the primary functions and features of the PDE?
  - info: Example: SmartSensor S2 measures temperature and humidity transmitting data via Wi-Fi to the manufacturer’s cloud
  - info: Reference: Annex II, 4 CRA
- **Security-Relevant Features**: Does the "Intended Purpose & Security Characteristics" which are the security-relevant features?
  - info: Example: Encrypted communications (TLS1.3), device authentication, automatic firmware upgrades
  - info: Reference: Annex II, 4 CRA
- **Intended Applications of the PDE**: Does the "Intended Purpose & Security Characteristics" contain which are the intended applications of the PDE?
  - info: Example: Detect changes in climatological environment at home.
  - info: Example: Available in the user manual and quick start guide.
  - info: Reference: Annex II, 4 CRA
- **Security Environment Provided**: Does the "Intended Purpose & Security Characteristics" contain what is the security environment you provide in which this PDE operates?
  - info: Reference: Annex II, 4 CRA
- **Target Environment**: Does the "Intended Purpose & Security Characteristics" contain what is the target environment for this PDE?
  - info: Example: Home environment only.
  - info: Reference: Annex II, 4 CRA
- **Target Users**: Does the "Intended Purpose & Security Characteristics" contain who are target users of this PDE?
  - info: Example: Consumer device / professional use.
  - info: Reference: Annex II, 4 CRA
### Foreseeable Conditions Leading to Cybersecurity Risks
put-description: Manufacturers must identify any known or reasonably foreseeable circumstances—whether arising during intended use or foreseeable misuse—that could result in significant cybersecurity risks. This ensures that potential risk scenarios are documented and considered during design, development, and user communication.
- **Foreseeable Circumstances Leading to Cybersecurity Risks**: Does the "Foreseeable Conditions Leading to Cybersecurity Risks" include what are known or foreseeable circumstances which may lead to significant cybersecurity risks?
  - info: Example: Using the product without changing the default password may expose it to unauthorised access.
  - info: Reference: Annex II, 5 CRA
### Access to the EU Declaration of Conformity
put-description: Where applicable, manufacturers must provide the internet address where the product’s EU Declaration of Conformity can be accessed. This ensures users and authorities can easily obtain the official compliance documentation in a reliable and accessible manner.
- **DoC Internet Address**: Does the "Access to the EU Declaration of Conformity" contain what is the internet address at which the EU declaration of conformity can be accessed?
  - na: true
  - info: Example: www.smarthometech.eu/DoC/SS2
  - info: Reference: Annex II, 6 CRA
### Technical Security Support & Support Period
put-description: Manufacturers must specify the type of technical security support they provide—such as vulnerability handling, security patches, or update delivery—along with the end-date of the support period during which users can expect these security updates and vulnerability responses. This ensures transparency about how long the product will remain supported and secure
- **Technical Support Offered**: Does the "Technical Security Support & Support Period" contain the type of technical support is offered by the manufacturer?
  - info: Example: Security updates, Service Desk Delivery (24/7)
  - info: Reference: Annex II, 7 CRA
- **End Date of Support Period**: Does the "Technical Security Support & Support Period" contain what is the end date of the support period?
  - info: Example: Security updates provided automatically until 31 Dec 2030 via the SmartHome app.
  - info: Reference: Annex II, 7 CRA
- **Location of Detailed Security Instructions**: Does the "Technical Security Support & Support Period" contain where can users find detailed security instructions?
  - info: Example: Provided with the PDE, and available online on www.smarthometech.be/DetailedInstructions/SS2
  - info: Reference: Annex II, 8 CRA
### Detailed User Instructions & Security Guidance
put-description:This section requires manufacturers to provide comprehensive instructions—or an internet address linking to them—covering all security-relevant aspects of using the product with digital elements. These instructions must explain:
put-description: - the necessary measures for secure initial commissioning and secure use throughout the product’s lifetime;
put-description: - how changes to the product may impact data security;
put-description: - how to install security-relevant updates;
put-description: - the secure decommissioning process, including data removal;
put-description: - how to turn off the default setting for automatic security updates (as required by Annex I);
put-description: - and, where applicable, the information needed by integrators to ensure compliance with the essential cybersecurity requirements of Annex I and the documentation requirements of Annex VII.

- **Initial Setup Security Measures**: Does the "Detailed User Instructions & Security Guidance" contain what measures must users take during the initial setup to ensure the product is used securely?
  - info: Example: Change default password; connect only to trusted Wi-Fi networks.
  - info: Reference: Annex II, 8(a) CRA
- **Security Configurations / Default Settings**: Does the "Detailed User Instructions & Security Guidance" contain what security configurations or default settings are applied by the manufacturer at first use?
  - info: Example: Automatic updates enabled; firewall on by default.
  - info: Reference: Derived from Annex II, 8(a) CRA
- **User Actions Needed for Lifetime Security**: Does the "Detailed User Instructions & Security Guidance" contain what user actions are needed over the product’s lifetime to keep it secure?
  - info: Example: Install firmware updates, review access permissions regularly, follow recommended actions shown by the product, it is recommended to allow automatic security updates.
  - info: Reference: Annex II, 8(a) CRA
- **Automatic Installation of Security Updates**: Is automatic installation of security updates enabled by default?
  - info: Example: Yes
  - info: Reference: Annex II, 8(c) CRA
- **Disabling Automatic Security Updates**: Does the "Detailed User Instructions & Security Guidance" contain how can automatic installation of security updates be turned off?
  - info: Example: Settings > Updates > Advanced Options > Toggle off automatic updates
  - info: Reference: Annex II, 8(c) CRA
- **Changes Affecting Cybersecurity**: Does the "Detailed User Instructions & Security Guidance" contain what types of changes or modifications (software, hardware, configuration) could affect the product’s cybersecurity?
  - info: Example: Installing third-party apps, sideloading apps, replacing the default operating system
  - info: Reference: Annex II, 8(b) CRA
- **Notification of Security-Relevant Changes**: Have you determined and included, regarding "Detailed User Instructions to the User", how are users or integrators should be informed that a change could affect data or system security?
  - info: Example: Release notes, warning prompts before updates
  - info: Reference: Annex II, 8(f) CRA
- **Checking Security Status After Changes**: Does the "Detailed User Instructions & Security Guidance" contain how can users check the security status of the product after a change?
  - info: Example: Version info in settings; security dashboard at www.smarthometech.be/security
  - info: Reference: Annex II, 8(f) CRA
- **Installing Security-Relevant Updates**: Does the "Detailed User Instructions & Security Guidance" contain how can users install security-relevant updates?
  - info: Example: Automatic over-the-air (OTA) updates; manual download option
  - info: Reference: Annex II, 8(c) CRA
- **Verifying Successful Update Installation**: Does the "Detailed User Instructions & Security Guidance" contain what steps must users follow to confirm successful installation of security updates?
  - info: Example: Check version number after installation in settings
  - info: Reference: Annex II, 8(c) CRA
- **Secure Decommissioning or Disposal**: Does the "Detailed User Instructions & Security Guidance" contain how can users securely decommission or dispose of a product?
  - info: Example: Perform a factory reset (Settings > System > Recovery > Reset to factory settings)
  - info: Reference: Annex II, 8(d) CRA
- **Secure Data Deletion Before Disposal**: Does the "Detailed User Instructions & Security Guidance" contain how can users delete their data before disposal?
  - info: Example: Use a companion app for data wipe
  - info: Reference: Annex II, 8(d) CRA
- **Information for Integrators**: Does the "Detailed User Instructions & Security Guidance" contain what information do integrators need to ensure continued cybersecurity?
  - na: true
  - info: Example: API authentication method, patch policy
  - info: Reference: Annex II, 8(f) CRA
- **Documentation for Integrators**: Does the "Detailed User Instructions & Security Guidance" contain what documentation do you provide to integrators?
  - na: true
  - info: Example: Integration manual
  - info: Reference: Annex II, 8(f) CRA
- **Security Implications for Integration**: Does the "Detailed User Instructions & Security Guidance" contain what are the security implications (if any) specific to integrating the PDE into another system?
  - na: true
  - info: Example: Integrated Smart Sensor will rely on network encryption and authentication settings
  - info: Reference: Annex II, 8(f) CRA; Deliverable 2.5
