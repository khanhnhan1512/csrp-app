export interface FewShotExample {
  companyType: string;
  csrpRange: [number, number];
  reportText: string;
}

export const EXAMPLES: FewShotExample[] = [
  {
    companyType: "established infrastructure contractor in Alberta",
    csrpRange: [7, 9],
    reportText: `In our assessment, a company specific risk premium in the range of 7% to 9% is appropriate based on our consideration of the Company's risk profile. We consider the principal strengths and weaknesses and the opportunities and threats facing the Company going forward, including:

a) Long history of operations and profitability.

b) Very strong growth in revenue in fiscal 2022 and 2023 and a strong project pipeline for the next few years.

c) Strong and long-term relationships with customers.

d) Exposure to risks of economic downturn or recession which has a direct negative impact on infrastructure projects in Alberta.

e) There is a risk that the U.S. and Canada may enter a recession.

f) Inherent risks in forecast.`,
  },
  {
    companyType: "tourism and hospitality business",
    csrpRange: [6, 10],
    reportText: `In our assessment, a company specific risk premium in the range of 6% to 10% is appropriate based on our consideration of the Company's risk profile. We consider the principal strengths and weaknesses and the opportunities and threats facing the Company going forward, including:

a) Long history of operations and profitability.

b) Skilled and experienced management.

c) Projected increase in population that can boost tourism to the area.

d) The Company operates in the tourism sector, which can be impacted significantly by economic downturns.`,
  },
  {
    companyType: "cannabis retail business in Alberta",
    csrpRange: [10, 12],
    reportText: `A company-specific risk premium in the range of 10.00% to 12.00% is appropriate based on our consideration of the Company's risk profile. We consider the principal strengths and weaknesses and the opportunities and threats facing the Company going forward, including:

a) Consistent revenue growth and profitability.

b) Most revenue and expenses of the Company are recurring in nature, which reduces uncertainty in future cash flows.

c) The Company has a reliable cannabis product supplier that offers price stability.

d) Anticipated continued growth in population and economy of Alberta.

e) The Company has a short history of operation.

f) The cannabis retail industry in which the Company operates is competitive.

g) The Company operates in a highly regulated industry, which increases its susceptibility to regulatory risks.

h) Exposure to risks of economic downturn or recession as it has a direct impact on consumer spending.`,
  },
  {
    companyType: "seasonal food service business dependent on school contracts",
    csrpRange: [14, 16],
    reportText: `A company-specific risk premium in the range of 14.0% to 16.0% is appropriate based on our consideration of the Company's risk profile. We consider the principal strengths and weaknesses and the opportunities and threats facing the Company going forward, including:

a) The Company exhibited significant revenue growth and improved profitability.

b) The Company does not have a contract with any of the schools it services.

c) The business is somewhat dependent on the owners.

d) Continued growth in the population and the economy of Vancouver.

e) The Company has a short history of operation.

f) The Company is impacted by seasonality.

g) The Company is exposed to economic downturns or recessions as it has a direct impact on consumer spending.`,
  },
];

export function selectExamples(csrpLow: number, csrpHigh: number): FewShotExample[] {
  const midpoint = (csrpLow + csrpHigh) / 2;
  return [...EXAMPLES]
    .sort((a, b) => {
      const aMid = (a.csrpRange[0] + a.csrpRange[1]) / 2;
      const bMid = (b.csrpRange[0] + b.csrpRange[1]) / 2;
      return Math.abs(aMid - midpoint) - Math.abs(bMid - midpoint);
    })
    .slice(0, 2);
}
