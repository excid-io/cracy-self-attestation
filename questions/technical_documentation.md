# Technical Documentation
## General Description 
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

## Description of the Design, Development and Production
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
## Assessment of the Cybersecurity Risks 
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
## Support Period 
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

## Harmonised Standards 
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
## Reports of The Tests 
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

## EU Declaration of Conformity
put-description: The technical documentation shall include a copy of the EU Declaration of Conformity for the product with digital elements. This document confirms that the product complies with the relevant provisions of the regulation and any other applicable Union legislation. This section should include: 

put-description: - the complete and signed EU Declaration of Conformity; 

put-description: The declaration must be the final version provided to users or authorities and must match the product and version documented elsewhere in the technical file. 
- **Completed & Signed EU Declaration of Conformity**: Does the “EU declaration of conformity” contain a completed and signed EU Declaration of Conformity?
  - info: Point to the question set about the EU Declaration.
  - info: Annex VII(7)