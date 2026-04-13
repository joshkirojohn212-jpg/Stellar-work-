"use client";

import { callContract, nativeToScVal } from "@/lib/stellar";
import type { Job } from "@/lib/types";

const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID ?? "";

function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (normalized.length % 2 !== 0) {
    throw new Error("Invalid hex input.");
  }
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    bytes[i / 2] = Number.parseInt(normalized.slice(i, i + 2), 16);
  }
  return bytes;
}

function requireContractId(): string {
  if (!contractId) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ID is not configured.");
  }
  return contractId;
}

export async function postJob(
  client: string,
  amount: string,
  descHashHex: string,
  deadline: string,
) {
  return callContract(requireContractId(), "post_job", [
    nativeToScVal(client, { type: "address" }),
    nativeToScVal(amount, { type: "i128" }),
    nativeToScVal(hexToBytes(descHashHex), { type: "bytes" }),
    nativeToScVal(deadline, { type: "u64" }),
  ]);
}

export async function acceptJob(freelancer: string, jobId: string) {
  return callContract(requireContractId(), "accept_job", [
    nativeToScVal(freelancer, { type: "address" }),
    nativeToScVal(jobId, { type: "u64" }),
  ]);
}

export async function submitWork(freelancer: string, jobId: string) {
  return callContract(requireContractId(), "submit_work", [
    nativeToScVal(freelancer, { type: "address" }),
    nativeToScVal(jobId, { type: "u64" }),
  ]);
}

export async function approveWork(client: string, jobId: string) {
  return callContract(requireContractId(), "approve_work", [
    nativeToScVal(client, { type: "address" }),
    nativeToScVal(jobId, { type: "u64" }),
  ]);
}

export async function cancelJob(client: string, jobId: string) {
  return callContract(requireContractId(), "cancel_job", [
    nativeToScVal(client, { type: "address" }),
    nativeToScVal(jobId, { type: "u64" }),
  ]);
}

export async function getJob(jobId: string): Promise<Job | null> {
  const response = await callContract(requireContractId(), "get_job", [
    nativeToScVal(jobId, { type: "u64" }),
  ], { readOnly: true });
  return (response as Job) ?? null;
}

export async function getJobCount(): Promise<number> {
  const response = await callContract(requireContractId(), "get_job_count", [], {
    readOnly: true,
  });
  return Number(response ?? 0);
}
