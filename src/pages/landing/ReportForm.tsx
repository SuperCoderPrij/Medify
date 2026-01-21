import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ReportForm() {
  const navigate = useNavigate();
  const submitReport = useMutation(api.reports.submitReport);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportForm, setReportForm] = useState({
    medicineName: "",
    batchNumber: "",
    reason: "",
    location: "",
    description: ""
  });

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.medicineName || !reportForm.reason) {
      toast.error("Please fill in the required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReport({
        medicineName: reportForm.medicineName,
        batchNumber: reportForm.batchNumber,
        reason: reportForm.reason,
        location: reportForm.location,
        description: reportForm.description,
      });
      toast.success("Report submitted successfully");
      setReportForm({
        medicineName: "",
        batchNumber: "",
        reason: "",
        location: "",
        description: ""
      });
      navigate("/reports");
    } catch (error) {
      toast.error("Failed to submit report");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 mb-6 border border-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Spot a Fake? Report It.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Help us build a safer world. If you suspect a medicine is counterfeit, report it immediately. 
            Your report helps manufacturers and authorities take action.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          <form onSubmit={handleReportSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="medicineName" className="text-gray-300">Medicine Name *</Label>
                <Input
                  id="medicineName"
                  placeholder="e.g. Paracetamol 500mg"
                  className="bg-slate-950/50 border-slate-800 focus:border-red-500/50"
                  value={reportForm.medicineName}
                  onChange={(e) => setReportForm({ ...reportForm, medicineName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNumber" className="text-gray-300">Batch Number (if available)</Label>
                <Input
                  id="batchNumber"
                  placeholder="e.g. BATCH-123"
                  className="bg-slate-950/50 border-slate-800 focus:border-red-500/50"
                  value={reportForm.batchNumber}
                  onChange={(e) => setReportForm({ ...reportForm, batchNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-gray-300">Reason for Suspicion *</Label>
                <Select 
                  value={reportForm.reason} 
                  onValueChange={(val) => setReportForm({ ...reportForm, reason: val })}
                >
                  <SelectTrigger className="bg-slate-950/50 border-slate-800 focus:border-red-500/50">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="packaging">Suspicious Packaging</SelectItem>
                    <SelectItem value="quality">Poor Quality/Appearance</SelectItem>
                    <SelectItem value="side_effects">Unexpected Side Effects</SelectItem>
                    <SelectItem value="price">Suspiciously Low Price</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">Location of Purchase</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="location"
                    placeholder="Pharmacy Name, City"
                    className="pl-9 bg-slate-950/50 border-slate-800 focus:border-red-500/50"
                    value={reportForm.location}
                    onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Additional Details</Label>
              <Textarea
                id="description"
                placeholder="Please describe what you observed..."
                className="bg-slate-950/50 border-slate-800 focus:border-red-500/50 min-h-[100px]"
                value={reportForm.description}
                onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Report <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
