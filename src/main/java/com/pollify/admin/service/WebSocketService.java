package com.pollify.admin.service;

import com.pollify.admin.dto.results.LiveResultsResponse;
import com.pollify.admin.multitenancy.TenantContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Epic 7: WebSocket Service for broadcasting live results
 */
@Service
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ResultsService resultsService;

    public WebSocketService(
            SimpMessagingTemplate messagingTemplate,
            ResultsService resultsService) {
        this.messagingTemplate = messagingTemplate;
        this.resultsService = resultsService;
    }

    /**
     * Epic 7 - Story 7.1: Broadcast election results to all connected clients
     * Topic format: /topic/{tenantId}/election/{electionId}/results
     */
    public void broadcastElectionResults(String tenantId, UUID electionId) {
        try {
            // Set tenant context to fetch results
            TenantContext.setTenantId(tenantId);

            // Get current results
            LiveResultsResponse results = resultsService.getLiveResults(electionId);

            // Broadcast to tenant-scoped topic
            String destination = String.format("/topic/%s/election/%s/results", tenantId, electionId);
            messagingTemplate.convertAndSend(destination, results);

            log.debug("Broadcasted results for election: {} in tenant: {}", electionId, tenantId);

        } catch (Exception e) {
            log.error("Error broadcasting election results: {}", e.getMessage(), e);
        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Broadcast election status change (DRAFT → ACTIVE → CLOSED)
     */
    public void broadcastElectionStatusChange(String tenantId, UUID electionId, String newStatus) {
        String destination = String.format("/topic/%s/election/%s/status", tenantId, electionId);
        messagingTemplate.convertAndSend(destination, newStatus);
        
        log.info("Broadcasted status change for election: {} to status: {}", electionId, newStatus);
    }
}
