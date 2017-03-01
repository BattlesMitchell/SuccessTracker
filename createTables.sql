CREATE TABLE agent
(
	name varchar(255),
	date bigint,
	dials int,
	contacts int,
	nurtures int,
	listingAppointments varchar(2550),
	buyerAppointments varchar(2550)
);

CREATE TABLE isa
(
	name varchar(255),
	date bigint,
	dials int,
	contacts int,
	nurtures int,
	listingAppointmentsSet varchar(2550),
	listingAppointmentsHeld varchar(2550),
	listingsTaken varchar(2550),
	buyerAppointmentsSet varchar(2550),
	buyerAppointmentsHeld varchar(2550),
	buyerBrokerAgreementsSigned varchar(2550),
	contractsWritten varchar(2550),
	contractsAccepted varchar(2550)
);