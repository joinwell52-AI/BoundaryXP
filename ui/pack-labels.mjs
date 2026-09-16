const industryNames = new Map([
  ['warehouse-inventory', '仓储库存 / Warehouse & Inventory'],
  ['software-ai', '软件与人工智能 / Software & AI'],
  ['financial-credit', '金融信贷 / Financial Credit'],
  ['crossborder-customs', '跨境通关 / Cross-border Customs'],
  ['government-affairs', '政务服务 / Government Affairs'],
  ['fleet-logistics', '车队物流 / Fleet & Logistics'],
  ['auto-rental', '汽车租赁 / Auto Rental'],
  ['healthcare-prescription', '医疗处方 / Healthcare & Prescriptions'],
  ['customer-refund', '客户退款 / Customer Refunds'],
  ['property-safety', '物业安全 / Property Safety'],
  ['procurement-bidding', '采购招投标 / Procurement & Bidding'],
  ['ops-sys', '系统运维 / System Operations'],
]);

export function packLabel(reference, language) {
  const pairedName = industryNames.get(reference.pack_id);
  const name = pairedName && language ? pairedName.split(' / ')[language === 'en' ? 1 : 0] : pairedName;
  return name ? `${name} · ${reference.version}` : `${reference.pack_id}@${reference.version}`;
}
