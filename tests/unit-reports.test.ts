/**
 * CropConnect Automated QA Test Suite: Complaints, Reports & Dispute Resolution
 */
import { submitComplaint, getComplaints, resolveComplaint } from '../src/lib/actions/reports'

export async function runReportTests(): Promise<{ name: string; passed: boolean; error?: string }[]> {
  const results: { name: string; passed: boolean; error?: string }[] = []

  let createdComplaintId = ''

  // Test 1: Submit new dispute report
  try {
    const res = await submitComplaint({
      reportedItem: 'Dinajpur Miniket Rice (Listing #p-1)',
      reportedType: 'Product Listing',
      reporterName: 'Rahman Agro Trading',
      reporterRole: 'Buyer',
      reason: 'Batch weight had a 2kg discrepancy upon weighing at hub warehouse.',
      phone: '+880 1712-334455'
    })

    if (!res.success || !res.complaint?.id) {
      throw new Error(`Failed to submit complaint: ${JSON.stringify(res)}`)
    }
    createdComplaintId = res.complaint.id
    results.push({ name: 'Dispute Management: Public complaint submission', passed: true })
  } catch (err: any) {
    results.push({ name: 'Dispute Management: Public complaint submission', passed: false, error: err.message })
  }

  // Test 2: Admin list retrieval
  try {
    const list = await getComplaints()
    if (!list || list.length === 0) {
      throw new Error('Complaint store returned empty list')
    }
    const found = list.find(c => c.id === createdComplaintId)
    if (!found) {
      throw new Error(`Recently created complaint ${createdComplaintId} not found in admin list`)
    }
    results.push({ name: 'Dispute Management: Admin dispute listing retrieval', passed: true })
  } catch (err: any) {
    results.push({ name: 'Dispute Management: Admin dispute listing retrieval', passed: false, error: err.message })
  }

  // Test 3: Admin resolution of dispute
  try {
    const res = await resolveComplaint(
      createdComplaintId,
      'resolved',
      'Farmer acknowledged packing error and refunded difference.'
    )
    if (!res.success) {
      throw new Error(`Failed to resolve complaint: ${JSON.stringify(res)}`)
    }

    const updatedList = await getComplaints()
    const resolvedItem = updatedList.find(c => c.id === createdComplaintId)
    if (!resolvedItem || resolvedItem.status !== 'resolved') {
      throw new Error(`Complaint status expected 'resolved', got: ${resolvedItem?.status}`)
    }
    results.push({ name: 'Dispute Management: Admin resolution with audit notes', passed: true })
  } catch (err: any) {
    results.push({ name: 'Dispute Management: Admin resolution with audit notes', passed: false, error: err.message })
  }

  return results
}
