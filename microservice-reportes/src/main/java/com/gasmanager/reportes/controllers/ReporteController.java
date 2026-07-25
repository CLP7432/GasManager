package com.gasmanager.reportes.controllers;

import com.gasmanager.reportes.dto.*;
import com.gasmanager.reportes.services.ExportService;
import com.gasmanager.reportes.services.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;
    private final ExportService exportService;

    // ========== REPORTES DE VENTAS ==========

    @GetMapping("/ventas")
    public ResponseEntity<List<ReporteVentasDTO>> getReporteVentas(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String metodoPago) {

        FiltrosReporteDTO filtros = FiltrosReporteDTO.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .estado(estado)
                .metodoPago(metodoPago)
                .build();

        return ResponseEntity.ok(reporteService.getReporteVentas(filtros));
    }

    @GetMapping("/ventas/exportar/excel")
    public ResponseEntity<byte[]> exportarVentasExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        LocalDateTime inicio = null;
        LocalDateTime fin = null;

        if (fechaInicio != null) {
            inicio = fechaInicio.atStartOfDay();
        }
        if (fechaFin != null) {
            fin = fechaFin.atTime(23, 59, 59);
        }

        byte[] excel = exportService.exportarVentasExcel(inicio, fin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_ventas.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }

    @GetMapping("/ventas/exportar/pdf")
    public ResponseEntity<byte[]> exportarVentasPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        LocalDateTime inicio = null;
        LocalDateTime fin = null;

        if (fechaInicio != null) {
            inicio = fechaInicio.atStartOfDay();
        }
        if (fechaFin != null) {
            fin = fechaFin.atTime(23, 59, 59);
        }

        byte[] pdf = exportService.exportarVentasPdf(inicio, fin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_ventas.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ========== REPORTES DE INVENTARIO ==========

    @GetMapping("/inventario")
    public ResponseEntity<List<ReporteInventarioDTO>> getReporteInventario() {
        return ResponseEntity.ok(reporteService.getReporteInventario());
    }

    @GetMapping("/inventario/exportar/excel")
    public ResponseEntity<byte[]> exportarInventarioExcel() {
        byte[] excel = exportService.exportarInventarioExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_inventario.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }

    @GetMapping("/inventario/exportar/pdf")
    public ResponseEntity<byte[]> exportarInventarioPdf() {
        byte[] pdf = exportService.exportarInventarioPdf();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_inventario.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ========== REPORTES DE FACTURACION ==========

    @GetMapping("/facturacion")
    public ResponseEntity<List<ReporteFacturacionDTO>> getReporteFacturacion(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {

        FiltrosReporteDTO filtros = FiltrosReporteDTO.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .build();

        return ResponseEntity.ok(reporteService.getReporteFacturacion(filtros));
    }

    @GetMapping("/facturacion/exportar/excel")
    public ResponseEntity<byte[]> exportarFacturacionExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {

        byte[] excel = exportService.exportarFacturacionExcel(fechaInicio, fechaFin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_facturacion.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }

    @GetMapping("/facturacion/exportar/pdf")
    public ResponseEntity<byte[]> exportarFacturacionPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {

        byte[] pdf = exportService.exportarFacturacionPdf(fechaInicio, fechaFin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_facturacion.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ========== REPORTES DE CREDITOS ==========

    @GetMapping("/creditos")
    public ResponseEntity<List<ReporteCreditosDTO>> getReporteCreditos(
            @RequestParam(required = false) String estado) {
        return ResponseEntity.ok(reporteService.getReporteCreditos(estado));
    }

    @GetMapping("/creditos/exportar/excel")
    public ResponseEntity<byte[]> exportarCreditosExcel() {
        byte[] excel = exportService.exportarCreditosExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_creditos.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }

    @GetMapping("/creditos/exportar/pdf")
    public ResponseEntity<byte[]> exportarCreditosPdf() {
        byte[] pdf = exportService.exportarCreditosPdf();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_creditos.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ========== REPORTES DE NOMINA ==========

    @GetMapping("/nomina")
    public ResponseEntity<List<ReporteNominaDTO>> getReporteNomina(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {

        FiltrosReporteDTO filtros = FiltrosReporteDTO.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .build();

        return ResponseEntity.ok(reporteService.getReporteNomina(filtros));
    }

    @GetMapping("/nomina/exportar/excel")
    public ResponseEntity<byte[]> exportarNominaExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {

        byte[] excel = exportService.exportarNominaExcel(fechaInicio, fechaFin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_nomina.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }

    @GetMapping("/nomina/exportar/pdf")
    public ResponseEntity<byte[]> exportarNominaPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {

        byte[] pdf = exportService.exportarNominaPdf(fechaInicio, fechaFin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_nomina.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ========== REPORTES DE LEALTAD ==========

    @GetMapping("/lealtad")
    public ResponseEntity<List<ReporteLealtadDTO>> getReporteLealtad() {
        return ResponseEntity.ok(reporteService.getReporteLealtad());
    }

    @GetMapping("/lealtad/exportar/excel")
    public ResponseEntity<byte[]> exportarLealtadExcel() {
        byte[] excel = exportService.exportarLealtadExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_lealtad.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }

    @GetMapping("/lealtad/exportar/pdf")
    public ResponseEntity<byte[]> exportarLealtadPdf() {
        byte[] pdf = exportService.exportarLealtadPdf();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_lealtad.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}