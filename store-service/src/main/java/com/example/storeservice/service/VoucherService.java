package com.example.storeservice.service;

import com.example.storeservice.dto.VoucherDTO;
import com.example.storeservice.dto.VoucherRequestDTO;

import java.util.List;

public interface VoucherService {
    VoucherDTO createVoucher(String userId, String storeId, VoucherRequestDTO request);
    List<VoucherDTO> getVouchersByStore(String storeId);
    VoucherDTO getVoucherById(String voucherId);
    VoucherDTO updateVoucher(String userId, String storeId, String voucherId, VoucherRequestDTO request);
    List<VoucherDTO> getDeletedVouchers(String storeId);
    void deleteVoucher(String userId, String storeId, String voucherId);
    void restoreVoucher(String userId, String storeId, String voucherId);
}
