"use client";

import { acceptJob, approveWork, cancelJob, getJob, submitWork } from "@/lib/contract";
import { connectWallet } from "@/lib/stellar";
import type { Job } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [wallet, setWallet] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);

  const load = async () => {
    setJob(await getJob(id));
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isClient = wallet && job && wallet === job.client;
  const isFreelancer = wallet && job && wallet === job.freelancer;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Job #{id}</h1>
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          onClick={async () => setWallet(await connectWallet())}
        >
          {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>

      {!job && <p className="text-sm text-slate-600">Loading...</p>}
      {job && (
        <article className="rounded-lg border border-slate-200 bg-white p-5 text-sm">
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Client:</strong> {job.client}</p>
          <p><strong>Freelancer:</strong> {job.freelancer ?? "Not assigned"}</p>
          <p><strong>Amount:</strong> {job.amount} stroops</p>
          <p><strong>Description hash:</strong> {job.description_hash}</p>
          <p><strong>Deadline:</strong> {job.deadline === "0" ? "No deadline" : new Date(Number(job.deadline) * 1000).toLocaleString()}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {wallet && job.status === "Open" && (
              <button
                className="rounded-md border border-slate-300 px-3 py-1.5"
                onClick={async () => {
                  await acceptJob(wallet, id);
                  await load();
                }}
              >
                Accept Job
              </button>
            )}

            {isFreelancer && job.status === "InProgress" && (
              <button
                className="rounded-md border border-slate-300 px-3 py-1.5"
                onClick={async () => {
                  await submitWork(wallet, id);
                  await load();
                }}
              >
                Submit Work
              </button>
            )}

            {isClient && job.status === "SubmittedForReview" && (
              <button
                className="rounded-md border border-slate-300 px-3 py-1.5"
                onClick={async () => {
                  await approveWork(wallet, id);
                  await load();
                }}
              >
                Approve Work
              </button>
            )}

            {isClient && job.status === "Open" && (
              <button
                className="rounded-md border border-slate-300 px-3 py-1.5"
                onClick={async () => {
                  await cancelJob(wallet, id);
                  await load();
                }}
              >
                Cancel Job
              </button>
            )}
          </div>
        </article>
      )}
    </section>
  );
}
