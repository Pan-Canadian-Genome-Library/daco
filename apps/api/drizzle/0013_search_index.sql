CREATE INDEX "search_index" ON "application_contents" USING gin ((
				setweight(to_tsvector('english', "application_id"::text), 'A') ||
				setweight(to_tsvector('english', "applicant_first_name" || ' ' || "applicant_last_name"), 'B') ||
				setweight(to_tsvector('english', "applicant_institutional_email"), 'C') ||
				setweight(to_tsvector('english', "applicant_primary_affiliation"), 'D') 
	  		));