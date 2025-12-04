import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFollowRequests } from "@/hooks/useFollowRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function FollowRequests() {
  const { 
    pendingRequests, 
    sentRequests, 
    isLoadingPending, 
    isLoadingSent,
    acceptRequest, 
    rejectRequest,
    cancelRequest 
  } = useFollowRequests();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Follow Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="received">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="received">
                  Received ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="sent">
                  Sent ({sentRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="received" className="space-y-4 mt-4">
                {isLoadingPending ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading requests...
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending follow requests
                  </div>
                ) : (
                  pendingRequests.map((request: any) => (
                    <Card key={request.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <Link 
                          to={`/profile/${request.requester_id}`}
                          className="flex items-center gap-3 flex-1"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.requester?.avatar_url || ''} />
                            <AvatarFallback>
                              {request.requester?.full_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {request.requester?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Wants to follow you
                            </p>
                          </div>
                        </Link>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => acceptRequest(request.id, request.requester_id)}
                            className="gap-1"
                          >
                            <Check className="h-4 w-4" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => rejectRequest(request.id)}
                            className="gap-1"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="sent" className="space-y-4 mt-4">
                {isLoadingSent ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading requests...
                  </div>
                ) : sentRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending sent requests
                  </div>
                ) : (
                  sentRequests.map((request: any) => (
                    <Card key={request.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <Link 
                          to={`/profile/${request.requested_id}`}
                          className="flex items-center gap-3 flex-1"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.requested?.avatar_url || ''} />
                            <AvatarFallback>
                              {request.requested?.full_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {request.requested?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Request pending
                            </p>
                          </div>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => cancelRequest(request.id)}
                        >
                          Cancel Request
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
