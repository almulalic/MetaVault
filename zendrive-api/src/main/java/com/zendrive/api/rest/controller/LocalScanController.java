package com.zendrive.api.rest.controller;

import com.zendrive.api.core.model.metafile.MetaFile;
import com.zendrive.api.core.service.metafile.scan.LocalScanService;
import com.zendrive.api.rest.model.dto.scan.ScanCheckResponse;
import com.zendrive.api.rest.model.dto.scan.local.LocalScanDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@ApiVersion(1)
@RequestMapping("api/file/scan/local")
public class LocalScanController {
    private final LocalScanService localScanService;

    public LocalScanController(LocalScanService localScanService) {
        this.localScanService = localScanService;
    }

    @RequestMapping(method = RequestMethod.POST, path = "/check")
    public ResponseEntity<ScanCheckResponse> checkLocalPath(
      @RequestBody LocalScanDto localScanDto
    ) {
        return ResponseEntity.ok(this.localScanService.check(localScanDto.getPath()));
    }

    @RequestMapping(method = RequestMethod.POST, path = "")
    public ResponseEntity<MetaFile> uploadLocal(
      @RequestBody LocalScanDto localScanDto
    ) {
        return ResponseEntity.ok(
          this.localScanService.scan(
            localScanDto.getPath(),
            localScanDto.getDestinationId(),
            localScanDto.getPermissions()
          )
        );
    }
}
