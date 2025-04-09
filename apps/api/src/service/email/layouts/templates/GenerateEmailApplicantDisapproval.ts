import { basicLayout } from '../renderBaseHtml.ts';

export const GenerateEmailApplicantDisapproval = () => {
	const template = `  
            <mj-column css-class="section-wrapper">
                <mj-text>
                    Dear [Applicant's Name],
                </mj-text>
                <mj-text>
                    <br />
                </mj-text>
                <mj-text>Thank you for submitting your application to the PCGL DACO. After careful review, we regret to inform you that your application has not been approved. As a result, you will not have access to the requested data.
                </mj-text>
                <mj-text>This is the Data Access Committee's comments on your application: [insert comments].
                </mj-text>
                <mj-text>We appreciate your interest in the PCGL controlled data, thank you again for your time!
        
                </mj-text>
                <mj-text>
                    Best regards,<br />
                    The PCGL Data Access Compliance Office
                </mj-text>
            </mj-column>
`;

	return basicLayout({ body: template }).html;
};
